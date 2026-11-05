"""
RESOLVE NOTEBOOK - Serviço de Recebimento de Solicitações e Notificações (Python)
Executa em porta dedicada (default: 5001) com SQLite nativo.
Idempotência, validação de telefone, máscara de privacidade em logs e fila de envio.
"""

import os
import sys
import json
import sqlite3
import re
import time
import uuid
import datetime
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

PORT = int(os.environ.get("LEADS_SERVICE_PORT", 5001))
DATA_DIR = os.environ.get("DATA_DIR", os.path.join(os.path.dirname(__file__), "data"))
DB_PATH = os.path.join(DATA_DIR, "leads.db")
WHATSAPP_API_URL = os.environ.get("WHATSAPP_API_URL", "http://127.0.0.1:3010")
WHATSAPP_API_SECRET = os.environ.get("WHATSAPP_API_SECRET", "cledson2026")
STORE_WHATSAPP = os.environ.get("STORE_WHATSAPP", "5511988095982")
# Destinatários configuráveis: 'both', 'store', 'client', ou 'none'
DISPATCH_TARGET = os.environ.get("DISPATCH_TARGET", "both").lower()
# Disparo real desativado por padrão nos testes conforme especificação
DISPATCH_ENABLED = os.environ.get("DISPATCH_ENABLED", "false").lower() in ("true", "1", "yes")

os.makedirs(DATA_DIR, exist_ok=True)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            protocol TEXT UNIQUE NOT NULL,
            idempotency_key TEXT UNIQUE,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            brand TEXT,
            model TEXT,
            issue TEXT,
            answers_json TEXT,
            notes TEXT,
            dispatch_target TEXT,
            store_dispatch_status TEXT DEFAULT 'pending',
            client_dispatch_status TEXT DEFAULT 'pending',
            error_message TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_protocol ON leads(protocol)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_idempotency ON leads(idempotency_key)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone)")
    conn.commit()
    conn.close()

init_db()

def mask_phone(phone: str) -> str:
    """Oculta o telefone completo para proteção de privacidade em logs."""
    clean = re.sub(r"\D", "", phone or "")
    if len(clean) >= 4:
        return clean[:2] + "****" + clean[-4:]
    return "****"

def normalize_brazilian_phone(phone: str) -> tuple[str, bool]:
    """
    Normaliza e valida telefone brasileiro.
    Aceita com ou sem formatação, com ou sem código do país (55).
    Exemplos válidos: (11) 98809-5982, 11988095982, 5511988095982.
    Retorna (telefone_normalizado, valido).
    """
    clean = re.sub(r"\D", "", phone or "")
    if clean.startswith("55") and len(clean) in (12, 13):
        clean = clean[2:]
    
    # Telefone com DDD: 10 dígitos (fixo) ou 11 dígitos (móvel)
    if len(clean) not in (10, 11):
        return "", False
    
    ddd = int(clean[:2])
    # DDDs válidos no Brasil variam de 11 a 99
    if ddd < 11 or ddd > 99:
        return "", False

    if len(clean) == 11 and clean[2] != "9":
        # Celular no Brasil deve iniciar com 9 após o DDD
        return "", False

    return f"55{clean}", True

def generate_protocol() -> str:
    now = datetime.datetime.now()
    prefix = now.strftime("RN-%y%m")
    random_part = str(uuid.uuid4().int)[:4].zfill(4)
    return f"{prefix}-{random_part}"

def send_whatsapp_message(phone: str, text: str) -> tuple[bool, str]:
    """Envia mensagem usando a instância de WhatsApp da VPS."""
    if not DISPATCH_ENABLED:
        return False, "Disparo real desativado nas configurações (DISPATCH_ENABLED=false)."
    
    url = f"{WHATSAPP_API_URL.rstrip('/')}/send"
    payload = {
        "phone": phone,
        "message": text
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "x-api-key": WHATSAPP_API_SECRET
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            if res_data.get("success"):
                return True, ""
            return False, res_data.get("error", "Erro retornado pela API do WhatsApp")
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")
        return False, f"HTTP {e.code}: {err_msg}"
    except Exception as e:
        return False, str(e)

def format_store_message(lead: dict) -> str:
    lines = [
        "📋 *NOVA SOLICITAÇÃO DE AVALIAÇÃO*",
        f"Protocolo: *{lead['protocol']}*",
        f"Data: {lead['created_at']}",
        "",
        f"👤 *Cliente:* {lead['name']}",
        f"📱 *WhatsApp:* https://wa.me/{lead['phone']}",
        f"💻 *Equipamento:* {lead.get('brand') or 'Não informado'} {lead.get('model') or ''}".strip(),
        f"⚠️ *Problema:* {lead.get('issue') or 'Geral'}",
    ]
    answers = lead.get("answers") or {}
    if answers:
        lines.append("")
        lines.append("📝 *Respostas do Diagnóstico:*")
        for k, v in answers.items():
            if v and v != "Não sei informar":
                lines.append(f"• {v}")
    if lead.get("notes"):
        lines.append(f"💬 *Detalhes:* {lead['notes']}")
    return "\n".join(lines)

def format_client_message(lead: dict) -> str:
    return (
        f"Olá, {lead['name']}! Sua solicitação de avaliação na *RESOLVE Notebook* foi recebida com sucesso.\n\n"
        f"📌 *Número do Protocolo:* `{lead['protocol']}`\n\n"
        f"Nossa equipe técnica na Santa Ifigênia já está com seus dados e entrará em contato em breve para apresentar o diagnóstico e opções.\n\n"
        f"Qualquer dúvida, pode responder diretamente a esta mensagem!"
    )

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class LeadsHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Idempotency-Key")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0].rstrip("/")
        
        if path == "/api/leads/health":
            self.send_response(200)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            conn = sqlite3.connect(DB_PATH)
            count = conn.cursor().execute("SELECT COUNT(*) FROM leads").fetchone()[0]
            conn.close()
            payload = {
                "status": "healthy",
                "service": "resolve-leads-python",
                "total_leads": count,
                "dispatch_enabled": DISPATCH_ENABLED,
                "dispatch_target": DISPATCH_TARGET
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))
            return

        # Listagem administrativa
        if path == "/api/leads":
            self.send_response(200)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT id, protocol, name, phone, brand, model, issue, store_dispatch_status, client_dispatch_status, created_at FROM leads ORDER BY id DESC LIMIT 50")
            rows = [dict(r) for r in cursor.fetchall()]
            conn.close()
            self.wfile.write(json.dumps(rows).encode("utf-8"))
            return

        self.send_response(404)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps({"error": "Endpoint não encontrado"}).encode("utf-8"))

    def do_POST(self):
        path = self.path.split("?")[0].rstrip("/")
        if path not in ("/api/leads", "/api/avaliacoes"):
            self.send_response(404)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Endpoint não encontrado"}).encode("utf-8"))
            return

        content_length = int(self.headers.get("Content-Length", 0))
        if content_length <= 0 or content_length > 1024 * 1024:
            self.send_response(400)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Corpo da requisição inválido"}).encode("utf-8"))
            return

        try:
            body = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except Exception:
            self.send_response(400)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "JSON inválido"}).encode("utf-8"))
            return

        name = str(body.get("name") or "").strip()
        raw_phone = str(body.get("phone") or "").strip()
        brand = str(body.get("brand") or "").strip()
        model = str(body.get("model") or "").strip()
        issue = str(body.get("issue") or "").strip()
        notes = str(body.get("notes") or "").strip()
        answers = body.get("answers") if isinstance(body.get("answers"), dict) else {}
        idempotency_key = str(body.get("idempotencyKey") or self.headers.get("X-Idempotency-Key") or "").strip()

        # Validação básica
        if len(name) < 2:
            self.send_response(400)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Por favor, informe seu nome."}).encode("utf-8"))
            return

        norm_phone, is_valid_phone = normalize_brazilian_phone(raw_phone)
        if not is_valid_phone:
            self.send_response(400)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Por favor, informe um WhatsApp válido com DDD."}).encode("utf-8"))
            return

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # 1. Checagem de idempotência
        if idempotency_key:
            cursor.execute("SELECT * FROM leads WHERE idempotency_key = ?", (idempotency_key,))
            existing = cursor.fetchone()
            if existing:
                conn.close()
                sys.stdout.write(f"[IDEMPOTENCY] Reutilizando protocolo {existing['protocol']} para chave {idempotency_key[:8]}...\n")
                sys.stdout.flush()
                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "protocol": existing["protocol"],
                    "message": "Solicitação já registrada com sucesso.",
                    "status": "existing"
                }).encode("utf-8"))
                return

        # 2. Prevenção de duplicidade por clique rápido (mesmo telefone e problema nos últimos 2 minutos)
        two_mins_ago = (datetime.datetime.now() - datetime.timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            SELECT * FROM leads 
            WHERE phone = ? AND issue = ? AND created_at >= ?
            ORDER BY id DESC LIMIT 1
        """, (norm_phone, issue, two_mins_ago))
        recent = cursor.fetchone()
        if recent:
            conn.close()
            sys.stdout.write(f"[DEDUP] Bloqueando duplicidade recente. Retornando protocolo {recent['protocol']} ({mask_phone(norm_phone)})\n")
            sys.stdout.flush()
            self.send_response(200)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "protocol": recent["protocol"],
                "message": "Solicitação recente já recebida.",
                "status": "existing"
            }).encode("utf-8"))
            return

        # 3. Geração de protocolo único e inserção no banco
        protocol = generate_protocol()
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        answers_str = json.dumps(answers, ensure_ascii=False)

        try:
            cursor.execute("""
                INSERT INTO leads (
                    protocol, idempotency_key, name, phone, brand, model, issue, 
                    answers_json, notes, dispatch_target, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                protocol, idempotency_key or None, name, norm_phone, brand, model, issue,
                answers_str, notes, DISPATCH_TARGET, now_str, now_str
            ))
            conn.commit()
            lead_id = cursor.lastrowid
        except Exception as e:
            conn.close()
            sys.stderr.write(f"[DB ERROR] Falha ao gravar lead: {e}\n")
            self.send_response(500)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Erro ao salvar solicitação. Tente novamente."}).encode("utf-8"))
            return

        sys.stdout.write(f"[LEAD REGISTRADO] Protocolo: {protocol} | Cliente: {name[:12]} | Fone: {mask_phone(norm_phone)}\n")
        sys.stdout.flush()

        # 4. Envio de notificações em fila/separado
        lead_dict = {
            "protocol": protocol,
            "name": name,
            "phone": norm_phone,
            "brand": brand,
            "model": model,
            "issue": issue,
            "notes": notes,
            "answers": answers,
            "created_at": now_str
        }

        store_status = "disabled" if not DISPATCH_ENABLED else "pending"
        client_status = "disabled" if not DISPATCH_ENABLED else "pending"
        err_log = []

        if DISPATCH_ENABLED:
            # Envio para a loja
            if DISPATCH_TARGET in ("store", "both"):
                store_msg = format_store_message(lead_dict)
                ok, err = send_whatsapp_message(STORE_WHATSAPP, store_msg)
                store_status = "sent" if ok else "failed"
                if not ok: err_log.append(f"Loja: {err}")

            # Envio para o cliente
            if DISPATCH_TARGET in ("client", "both"):
                client_msg = format_client_message(lead_dict)
                ok, err = send_whatsapp_message(norm_phone, client_msg)
                client_status = "sent" if ok else "failed"
                if not ok: err_log.append(f"Cliente: {err}")

        # Atualiza status de envio
        cursor.execute("""
            UPDATE leads 
            SET store_dispatch_status = ?, client_dispatch_status = ?, error_message = ?, updated_at = ?
            WHERE id = ?
        """, (store_status, client_status, "; ".join(err_log) or None, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), lead_id))
        conn.commit()
        conn.close()

        # Resposta de confirmação imediata com protocolo
        self.send_response(201)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps({
            "success": True,
            "protocol": protocol,
            "message": "Solicitação registrada com sucesso!",
            "store_status": store_status,
            "client_status": client_status
        }).encode("utf-8"))

def run_server(port=PORT):
    server = ThreadedHTTPServer(("0.0.0.0", port), LeadsHandler)
    sys.stdout.write(f"RESOLVE Notebook Leads Service (Python) ativo na porta {port}\n")
    sys.stdout.flush()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    p = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(p)

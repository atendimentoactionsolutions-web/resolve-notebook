import unittest
import json
import os
import sys
import tempfile
import urllib.request
import threading
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server_leads import normalize_brazilian_phone, mask_phone, generate_protocol, ThreadedHTTPServer, LeadsHandler, init_db

class TestLeadsService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.mkdtemp()
        os.environ["DATA_DIR"] = cls.temp_dir
        import server_leads
        server_leads.DB_PATH = os.path.join(cls.temp_dir, "test_leads.db")
        server_leads.init_db()

        cls.port = 5991
        cls.server = ThreadedHTTPServer(("127.0.0.1", cls.port), LeadsHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        time.sleep(0.1)

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def test_phone_normalization(self):
        # Válidos com 11 dígitos
        norm, ok = normalize_brazilian_phone("(11) 98809-5982")
        self.assertTrue(ok)
        self.assertEqual(norm, "5511988095982")

        # Válidos com 10 dígitos (fixo)
        norm, ok = normalize_brazilian_phone("1133334444")
        self.assertTrue(ok)
        self.assertEqual(norm, "551133334444")

        # Válidos já com 55
        norm, ok = normalize_brazilian_phone("5511988095982")
        self.assertTrue(ok)
        self.assertEqual(norm, "5511988095982")

        # Inválido: DDD inexistente (ex: DDD 05)
        norm, ok = normalize_brazilian_phone("05988095982")
        self.assertFalse(ok)

        # Inválido: muito curto
        norm, ok = normalize_brazilian_phone("119880")
        self.assertFalse(ok)

    def test_phone_masking(self):
        masked = mask_phone("5511988095982")
        self.assertEqual(masked, "55****5982")
        self.assertNotIn("98809", masked)

    def test_protocol_generation(self):
        proto = generate_protocol()
        self.assertTrue(proto.startswith("RN-"))
        self.assertEqual(len(proto), 12)

    def test_create_lead_success_and_idempotency(self):
        url = f"http://127.0.0.1:{self.port}/api/leads"
        payload = {
            "name": "Cliente Teste",
            "phone": "(11) 98809-5982",
            "issue": "Não liga ou não carrega",
            "brand": "Dell",
            "model": "Inspiron 15",
            "idempotencyKey": "test-idem-key-12345",
            "answers": {
                "power-signal": "Não dá nenhum sinal",
                "charger": "É o original e está conectado"
            }
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as res:
            self.assertEqual(res.status, 201)
            resp = json.loads(res.read().decode("utf-8"))
            self.assertTrue(resp["success"])
            protocol1 = resp["protocol"]
            self.assertTrue(protocol1.startswith("RN-"))

        # Repete a mesma requisição com a mesma chave de idempotência
        req2 = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req2) as res2:
            self.assertEqual(res2.status, 200)
            resp2 = json.loads(res2.read().decode("utf-8"))
            self.assertTrue(resp2["success"])
            self.assertEqual(resp2["protocol"], protocol1)
            self.assertEqual(resp2.get("status"), "existing")

    def test_reject_invalid_phone(self):
        url = f"http://127.0.0.1:{self.port}/api/leads"
        payload = {
            "name": "Cliente Erro",
            "phone": "12345",
            "issue": "Tela quebrada"
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as res:
                self.fail("Deveria ter retornado erro 400")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 400)
            err = json.loads(e.read().decode("utf-8"))
            self.assertIn("WhatsApp válido", err["error"])

if __name__ == "__main__":
    unittest.main()

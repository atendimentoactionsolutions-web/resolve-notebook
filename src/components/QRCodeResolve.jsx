import React, { useState, useEffect } from 'react';

export default function QRCodeResolve({ onNavigate, isDark, onToggleDark }) {
  const [token, setToken] = useState(localStorage.getItem('resolve_admin_token') || '');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [waData, setWaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');

  // Carrega status da sessão
  const fetchStatus = async (authToken = token) => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/whatsapp/status', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem('resolve_admin_token');
        setLoginError('Sessão administrativa expirada. Faça login novamente.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setWaData(data);
    } catch (err) {
      setWaData({ status: 'DISCONNECTED', message: 'Erro ao verificar status do WhatsApp.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStatus(token);
      // Polling de 4 segundos enquanto na tela
      const interval = setInterval(() => fetchStatus(token), 4000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: usernameInput.trim(), 
          password: passwordInput 
        })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('resolve_admin_token', data.token);
        setLoginError('');
        fetchStatus(data.token);
      } else {
        setLoginError(data.error || 'Usuário ou senha incorretos.');
      }
    } catch (err) {
      setLoginError('Erro de conexão com o servidor.');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('resolve_admin_token');
  };

  const handleResetSession = async () => {
    if (!window.confirm('Tem certeza que deseja desconectar/reiniciar a sessão do WhatsApp?')) return;
    setActionMsg('');
    setActionError('');
    try {
      const res = await fetch('/api/whatsapp/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setActionMsg('Sessão reiniciada. Aguarde a geração do novo QR Code.');
        fetchStatus(token);
      } else {
        setActionError(data.error || 'Não foi possível reiniciar a sessão.');
      }
    } catch (err) {
      setActionError('Falha ao comunicar com o servidor.');
    }
  };

  const formatPhoneNumber = (val) => {
    if (!val) return '';
    const clean = String(val).replace(/\D/g, '');
    if (clean.length === 13 && clean.startsWith('55')) {
      return `+55 (${clean.slice(2, 4)}) ${clean.slice(4, 9)}-${clean.slice(9)}`;
    }
    if (clean.length === 12 && clean.startsWith('55')) {
      return `+55 (${clean.slice(2, 4)}) ${clean.slice(4, 8)}-${clean.slice(8)}`;
    }
    return `+${clean}`;
  };

  return (
    <div className="admin-page" style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* Header */}
      <header className="store-app-header">
        <a 
          className="brand" 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
          aria-label="Resolve Notebook, página inicial"
        >
          <img src="/assets/logo-original.png" alt="" width="44" height="44" />
          <span>RESOLVE<span className="brand-sub">NOTEBOOK</span></span>
        </a>

        <nav aria-label="Navegação administrativa">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>
            Voltar ao site
          </a>
          <a href="/admin" onClick={(e) => { e.preventDefault(); onNavigate('/admin'); }}>
            Painel Lojista
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onToggleDark && (
            <button
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? "Modo claro" : "Modo escuro"}
              title={isDark ? "Mudar para modo claro (Alt+D)" : "Mudar para modo escuro (Alt+D)"}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                transition: 'transform 0.2s ease'
              }}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', color: '#ffd438' }}>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', color: '#17201f' }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}

          {token && (
            <button 
              type="button" 
              className="button button-dark" 
              onClick={handleLogout}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Sair
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="wrap" style={{ padding: '40px 0 80px 0' }}>
        {!token ? (
          /* Login de Acesso Restrito */
          <div className="auth-main" style={{ maxWidth: '440px', margin: '40px auto', background: 'var(--white)', padding: '36px 32px', borderRadius: '20px', border: '1px solid var(--line)', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <img 
              src="/assets/logo-original.png" 
              alt="Resolve Notebook" 
              width="54" 
              height="54" 
              style={{ borderRadius: '50%', margin: '0 auto 16px auto', display: 'block' }} 
            />
            <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
              Área Restrita · Autenticação Administrativa
            </p>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '26px', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Pareamento do WhatsApp
            </h1>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Entre com as credenciais autorizadas para visualizar o QR Code de conexão e gerenciar o WhatsApp da loja.
            </p>

            <form onSubmit={handleLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                  Usuário:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Digite o usuário"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                  Senha:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Digite a senha"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                />
              </div>

              {loginError && (
                <div style={{ padding: '10px', borderRadius: '8px', background: '#ffeef0', color: '#d92d20', fontSize: '12px', fontWeight: 600 }}>
                  {loginError}
                </div>
              )}

              <button 
                type="submit" 
                className="button button-yellow" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '6px' }}
              >
                Acessar Conexão WhatsApp
              </button>
            </form>
          </div>
        ) : (
          /* Painel de Pareamento Autenticado */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, color: 'var(--dark)' }}>
                INTEGRAÇÃO DE COMUNICAÇÃO
              </p>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', letterSpacing: '-0.02em' }}>
                Conexão WhatsApp da Loja
              </h1>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '15px' }}>
                Status em tempo real da sessão do WhatsApp responsável pelo envio automático de protocolos e orçamentos.
              </p>
            </div>

            {actionMsg && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
                {actionMsg}
              </div>
            )}
            {actionError && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ffeef0', color: '#d92d20', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
                {actionError}
              </div>
            )}

            {loading ? (
              <div style={{ background: 'var(--white)', padding: '40px', borderRadius: '20px', border: '1px solid var(--line)', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', margin: 0 }}>Consultando status da sessão…</p>
              </div>
            ) : waData?.status === 'CONNECTED' ? (
              /* ESTADO: CONECTADO (QR CODE É RETIRADO DA TELA CONFORME ESPECIFICAÇÃO) */
              <div style={{ background: 'var(--white)', padding: '36px', borderRadius: '20px', border: '1px solid var(--line)', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>

                <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '20px', background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '13px', marginBottom: '14px' }}>
                  ● SESSÃO CONECTADA
                </span>

                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                  WhatsApp Pareado com Sucesso
                </h2>
                
                <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
                  A sessão ativa está enviando notificações de avaliação e recebendo mensagens dos clientes normalmente.
                </p>

                <div style={{ background: 'var(--paper)', padding: '20px', borderRadius: '14px', border: '1px solid var(--line)', textAlign: 'left', marginBottom: '28px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', fontWeight: 600 }}>NÚMERO CONECTADO:</span>
                    <strong style={{ fontSize: '18px', color: 'var(--ink)' }}>{formatPhoneNumber(waData.user) || 'Dispositivo conectado'}</strong>
                  </div>
                  {waData.name && (
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', fontWeight: 600 }}>NOME DO PERFIL:</span>
                      <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>{waData.name}</strong>
                    </div>
                  )}
                </div>

                <button 
                  type="button" 
                  onClick={handleResetSession}
                  style={{ background: 'transparent', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Desconectar / Trocar Aparelho
                </button>
              </div>
            ) : waData?.qrCodeDataUrl || waData?.hasQr ? (
              /* ESTADO: AGUARDANDO LEITURA DO QR CODE */
              <div style={{ background: 'var(--white)', padding: '36px', borderRadius: '20px', border: '1px solid var(--line)', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '20px', background: '#fef3c7', color: '#b45309', fontWeight: 700, fontSize: '13px', marginBottom: '16px' }}>
                  ● AGUARDANDO LEITURA
                </span>

                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                  Escaneie o QR Code com o WhatsApp
                </h2>

                <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
                  Abra o WhatsApp no aparelho da loja, toque em <strong>Aparelhos conectados</strong> e selecione <strong>Conectar um aparelho</strong>.
                </p>

                {/* QR Code Container */}
                <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '2px solid var(--line)', display: 'inline-block', margin: '0 auto 20px auto', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                  <img 
                    src={waData.qrCodeDataUrl} 
                    alt="QR Code de conexão do WhatsApp" 
                    width="260" 
                    height="260" 
                    style={{ display: 'block' }}
                  />
                </div>

                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '24px' }}>
                  O código expira periodicamente e é renovado automaticamente pelo servidor.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    type="button" 
                    className="button button-yellow"
                    onClick={() => fetchStatus(token)}
                    style={{ fontSize: '13px', padding: '10px 20px' }}
                  >
                    Verificar Conexão
                  </button>
                  <button 
                    type="button" 
                    className="quiet-button"
                    onClick={handleResetSession}
                    style={{ fontSize: '13px', padding: '10px 20px' }}
                  >
                    Gerar Novo Código
                  </button>
                </div>
              </div>
            ) : (
              /* ESTADO: DESCONECTADO OU INICIALIZANDO */
              <div style={{ background: 'var(--white)', padding: '36px', borderRadius: '20px', border: '1px solid var(--line)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>

                <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '20px', background: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: '13px', marginBottom: '14px' }}>
                  ● DESCONECTADO
                </span>

                <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>
                  Nenhuma Sessão Ativa
                </h2>

                <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
                  {waData?.message || 'A instância do WhatsApp está pronta para pareamento. Clique abaixo para iniciar e gerar o código QR.'}
                </p>

                <button 
                  type="button" 
                  className="button button-yellow"
                  onClick={handleResetSession}
                  style={{ fontSize: '14px', padding: '12px 24px' }}
                >
                  Gerar QR Code de Pareamento
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

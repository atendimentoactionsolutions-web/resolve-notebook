import React, { useState, useEffect, useMemo } from 'react';
import CreditCardSimulator from './CreditCardSimulator';
import { calculateInstallments, formatMoney, formatPercent, DEFAULT_RATES } from '../utils/cardCalculator';

const CATEGORIES = ['Notebook', 'MacBook', 'Gamer', 'Corporativo', 'SSD & Peças', 'Acessório', 'Outro'];
const CONDITIONS = ['Seminovo', 'Revisado', 'Novo', 'Recondicionado', 'Mostruário'];
const WARRANTIES = ['3 Meses', '6 Meses', '1 Ano', '2 Anos', 'Garantia de Fábrica', 'Sem Garantia / No Estado'];

const RATE_PRESETS = {
  stone_ton: {
    name: 'Ton / Stone (Taxas Competitivas)',
    debit: 1.39,
    credit1x: 3.15,
    maxInstallments: 12,
    interestFreeInstallments: 1,
    calculationMode: 'compound',
    installments: {
      "1": 3.15, "2": 4.50, "3": 5.40, "4": 6.30, "5": 7.20, "6": 8.10,
      "7": 8.90, "8": 9.80, "9": 10.70, "10": 11.60, "11": 12.50, "12": 13.40, "18": 17.90
    }
  },
  pagbank: {
    name: 'PagBank (Moderninha)',
    debit: 1.99,
    credit1x: 3.79,
    maxInstallments: 12,
    interestFreeInstallments: 1,
    calculationMode: 'compound',
    installments: {
      "1": 3.79, "2": 4.99, "3": 5.99, "4": 6.99, "5": 7.99, "6": 8.99,
      "7": 9.99, "8": 10.99, "9": 11.99, "10": 12.99, "11": 13.99, "12": 14.99, "18": 19.99
    }
  },
  infinitepay: {
    name: 'InfinitePay (Smart)',
    debit: 0.75,
    credit1x: 2.89,
    maxInstallments: 12,
    interestFreeInstallments: 1,
    calculationMode: 'compound',
    installments: {
      "1": 2.89, "2": 4.10, "3": 4.90, "4": 5.70, "5": 6.50, "6": 7.30,
      "7": 8.10, "8": 8.90, "9": 9.70, "10": 10.50, "11": 11.30, "12": 12.10, "18": 15.90
    }
  },
  sem_juros: {
    name: '12x Sem Juros para o Cliente (Absorvido)',
    debit: 1.39,
    credit1x: 0,
    maxInstallments: 12,
    interestFreeInstallments: 12,
    calculationMode: 'simple',
    installments: {
      "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0,
      "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "18": 0
    }
  }
};

function parsePriceInput(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = String(val).replace(/[R$\s]/g, '').trim();
  if (clean.includes(',')) {
    return parseFloat(clean.replace(/\./g, '').replace(',', '.')) || 0;
  }
  return parseFloat(clean) || 0;
}

export default function Admin({ onNavigate, isDark, onToggleDark }) {
  const dark = isDark !== undefined 
    ? isDark 
    : (typeof document !== 'undefined' && document.body.classList.contains('dark-mode'));
  const [token, setToken] = useState(localStorage.getItem('resolve_admin_token') || '');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'rates'

  // Rates State
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesSaving, setRatesSaving] = useState(false);
  const [ratesSuccess, setRatesSuccess] = useState('');
  const [ratesError, setRatesError] = useState('');
  const [ratesTestPrice, setRatesTestPrice] = useState('2490');

  // Product Form State
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [installments, setInstallments] = useState('ou em até 12x no cartão');
  const [category, setCategory] = useState('Notebook');
  const [condition, setCondition] = useState('Seminovo');
  const [warranty, setWarranty] = useState('3 Meses');
  const [customWarranty, setCustomWarranty] = useState('');
  const [model, setModel] = useState('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [screen, setScreen] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadRates();
    if (token) {
      loadProducts();
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
      if (res.status === 401) { handleLogout(); setLoginError('Sua sessão expirou. Faça login novamente.'); return; }
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('resolve_admin_token', data.token);
      } else {
        setLoginError(data.error || 'Usuário ou senha incorretos.');
      }
    } catch (err) {
      setLoginError('Erro ao conectar ao servidor.');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('resolve_admin_token');
  };

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Não foi possível carregar os produtos.');
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      setProducts(list);
    } catch (err) {
      setFormError(err.message || 'Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }

  async function loadRates() {
    setRatesLoading(true);
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        setRates(data);
      }
    } catch (err) {
      console.warn('Usando taxas locais padrão:', err);
    } finally {
      setRatesLoading(false);
    }
  }

  const handleSaveRates = async (e) => {
    if (e) e.preventDefault();
    setRatesSaving(true);
    setRatesSuccess('');
    setRatesError('');

    try {
      const res = await fetch('/api/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rates)
      });

      if (res.status === 401) {
        handleLogout();
        setLoginError('Sua sessão expirou. Faça login novamente.');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setRatesSuccess('Taxas da maquininha atualizadas com sucesso! O site agora calcula as parcelas automaticamente com essas taxas.');
        setRates(data.rates || rates);
      } else {
        setRatesError(data.error || 'Erro ao salvar taxas.');
      }
    } catch (err) {
      setRatesError('Erro de conexão ao salvar taxas.');
    } finally {
      setRatesSaving(false);
    }
  };

  const handleApplyPreset = (presetKey) => {
    const preset = RATE_PRESETS[presetKey];
    if (!preset) return;
    setRates({
      ...rates,
      machineName: preset.name,
      debit: preset.debit,
      credit1x: preset.credit1x,
      maxInstallments: preset.maxInstallments,
      interestFreeInstallments: preset.interestFreeInstallments,
      calculationMode: preset.calculationMode,
      installments: { ...preset.installments }
    });
  };

  const handleRateChange = (installmentKey, val) => {
    const num = parseFloat(val.replace(',', '.')) || 0;
    setRates({
      ...rates,
      installments: {
        ...rates.installments,
        [installmentKey]: num
      }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.status === 401) handleLogout();
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        setFormError(data.error || 'Erro no envio da foto.');
      }
    } catch (err) {
      setFormError('Erro de conexão ao enviar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper to auto-generate installments text based on machine rates
  const handleAutoFillInstallments = () => {
    const num = parsePriceInput(price);
    if (!num || num <= 0) {
      setFormError('Digite um preço à vista primeiro para gerar o parcelamento.');
      return;
    }
    const sims = calculateInstallments(num, rates);
    if (sims.length > 0) {
      const last = sims[sims.length - 1];
      const autoText = `ou ${last.installment}x de ${formatMoney(last.installmentValue)} no cartão`;
      setInstallments(autoText);
      setFormSuccess(`Parcelamento gerado: ${autoText}`);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (saving || uploadingImage) return;

    if (!title.trim()) {
      setFormError('Informe o título do produto.');
      return;
    }

    setSaving(true);
    setFormSuccess('');
    setFormError('');

    const numericPrice = parsePriceInput(price);
    const finalWarranty = warranty === 'Personalizada' ? (customWarranty.trim() || '3 Meses') : warranty;

    const payload = {
      title: title.trim(),
      price: numericPrice,
      installments: installments.trim() || 'ou em até 12x no cartão',
      category: category || 'Notebook',
      condition: condition || 'Seminovo',
      warranty: finalWarranty,
      model: model.trim(),
      badge: `${condition} • Garantia ${finalWarranty}`,
      specs: { 
        cpu: cpu.trim(), 
        ram: ram.trim(), 
        storage: storage.trim(), 
        screen: screen.trim() 
      },
      description: description.trim(),
      image: imageUrl || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop',
      images: imageUrl ? [imageUrl, ...(products.find(p => p.id === editingId)?.images || []).filter(image => image !== imageUrl)] : [],
      status: editingId ? (products.find(p => p.id === editingId)?.status || 'available') : 'available'
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.status === 401) {
        handleLogout();
        setLoginError('Sua sessão expirou. Faça login novamente para salvar o produto.');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setFormSuccess(editingId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
        resetForm();
        loadProducts();
      } else {
        setFormError(data.error || 'Erro ao salvar produto.');
      }
    } catch (err) {
      setFormError('Erro ao comunicar com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setPrice(String(p.price || (p.priceCents ? p.priceCents / 100 : '')));
    setInstallments(p.installments || 'ou em até 12x no cartão');
    setCategory(p.category || 'Notebook');
    setCondition(p.condition || 'Seminovo');
    
    // Check if warranty matches preset or is custom
    const prodWarranty = p.warranty || (p.badge?.includes('Garantia') ? p.badge.split('Garantia')[1].trim() : '3 Meses');
    if (WARRANTIES.includes(prodWarranty)) {
      setWarranty(prodWarranty);
      setCustomWarranty('');
    } else {
      setWarranty('Personalizada');
      setCustomWarranty(prodWarranty);
    }

    setModel(p.model || '');
    setCpu(p.specs?.cpu || '');
    setRam(p.specs?.ram || '');
    setStorage(p.specs?.storage || '');
    setScreen(p.specs?.screen || '');
    setDescription(p.description || '');
    const img = (Array.isArray(p.images) && p.images[0]) || p.image || '';
    setImageUrl(img);
    setFormSuccess('');
    setFormError('');
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSold = async (p) => {
    const newStatus = p.status === 'sold' ? 'available' : 'sold';
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...p, status: newStatus })
      });
      if (res.status === 401) handleLogout();
      if (!res.ok) throw new Error('Não foi possível atualizar o produto.');
      loadProducts();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este produto do catálogo?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401) handleLogout();
      if (!res.ok) throw new Error('Não foi possível excluir o produto.');
      loadProducts();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setInstallments('ou em até 12x no cartão');
    setCategory('Notebook');
    setCondition('Seminovo');
    setWarranty('3 Meses');
    setCustomWarranty('');
    setModel('');
    setCpu('');
    setRam('');
    setStorage('');
    setScreen('');
    setDescription('');
    setImageUrl('');
    setFormError('');
  };

  // Metrics
  const productList = Array.isArray(products) ? products : [];
  const totalStock = productList.length;
  const availableCount = productList.filter(p => p.status !== 'sold').length;
  const soldCount = productList.filter(p => p.status === 'sold').length;
  const totalStockValue = productList
    .filter(p => p.status !== 'sold')
    .reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);

  const numericFormPrice = parsePriceInput(price);

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
          <a href="/produtos" onClick={(e) => { e.preventDefault(); onNavigate('/produtos'); }}>
            Ver catálogo
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

          {token ? (
            <button 
              type="button" 
              className="button button-dark" 
              onClick={handleLogout}
              style={{ fontSize: '13px', padding: '10px 18px' }}
            >
              Sair do Painel
            </button>
          ) : (
            <a 
              className="button button-dark" 
              href="https://wa.me/5511988095982" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="wrap" style={{ padding: '30px 0 80px 0' }}>
        {loading && <p role="status">Carregando catálogo…</p>}
        
        {!token ? (
          /* --- VIEW 1: LOGIN --- */
          <div className="auth-main" style={{ maxWidth: '440px', margin: '40px auto', background: 'var(--white)', padding: '36px 32px', borderRadius: '20px', border: '1px solid var(--line)', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <img 
              src="/assets/logo-original.png" 
              alt="Resolve Notebook" 
              width="54" 
              height="54" 
              style={{ borderRadius: '50%', margin: '0 auto 16px auto', display: 'block' }} 
            />

            <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
              Resolve Notebook
            </p>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Área do lojista.
            </h1>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Entre com as credenciais autorizadas para gerenciar produtos, editar estoque e cadastrar as taxas da maquininha.
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
                <div style={{ 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  background: dark ? 'rgba(239, 68, 68, 0.15)' : '#ffeef0', 
                  color: dark ? '#f87171' : '#d92d20', 
                  border: dark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                  fontSize: '12px', 
                  fontWeight: 600 
                }}>
                  {loginError}
                </div>
              )}

              <button 
                type="submit" disabled={saving || uploadingImage}
                className="button button-yellow" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '6px' }}
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        ) : (
          /* --- VIEW 2: AUTHENTICATED DASHBOARD --- */
          <div>
            {/* Dashboard Title & Tab Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 800, color: dark ? '#ffd438' : '#876c00', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                  PAINEL DE GESTÃO DA LOJA
                </p>
                <h1 style={{ margin: 0, fontSize: '32px', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                  Gerenciador Administrativo
                </h1>
              </div>

              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '8px', background: 'var(--white)', padding: '6px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === 'products' ? (dark ? '#ffd438' : '#17201f') : 'transparent',
                    color: activeTab === 'products' ? (dark ? '#17201f' : '#ffd438') : 'var(--ink)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  📦 Produtos & Estoque ({totalStock})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rates')}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === 'rates' ? (dark ? '#ffd438' : '#17201f') : 'transparent',
                    color: activeTab === 'rates' ? (dark ? '#17201f' : '#ffd438') : 'var(--ink)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  💳 Taxas da Maquininha
                </button>
              </div>
            </div>

            {/* TAB 1: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div>
                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>TOTAL NO ESTOQUE</span>
                    <strong style={{ fontSize: '28px', color: 'var(--ink)' }}>{totalStock}</strong>
                  </div>
                  <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>DISPONÍVEIS NA LOJA</span>
                    <strong style={{ fontSize: '28px', color: dark ? '#34d399' : '#059669' }}>{availableCount}</strong>
                  </div>
                  <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>VENDIDOS</span>
                    <strong style={{ fontSize: '28px', color: dark ? '#f87171' : '#dc2626' }}>{soldCount}</strong>
                  </div>
                  <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>VALOR EM ESTOQUE</span>
                    <strong style={{ fontSize: '22px', color: 'var(--ink)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalStockValue)}
                    </strong>
                  </div>
                </div>

                {/* EDIT MODE BANNER */}
                {editingId && (
                  <div style={{ 
                    background: dark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb', 
                    border: dark ? '1.5px solid rgba(245, 158, 11, 0.45)' : '1.5px solid #f59e0b', 
                    borderRadius: '14px', 
                    padding: '16px 20px', 
                    marginBottom: '24px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '12px' 
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>✏️</span>
                        <strong style={{ fontSize: '16px', color: dark ? '#fbbf24' : '#92400e' }}>
                          Editando Produto: {title || 'Sem título'}
                        </strong>
                      </div>
                      <span style={{ fontSize: '12px', color: dark ? '#fcd34d' : '#b45309', display: 'block', marginTop: '2px' }}>
                        ID: {editingId} · Ao salvar, as alterações aparecerão imediatamente no catálogo da loja.
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        type="button" 
                        onClick={resetForm}
                        style={{ 
                          background: dark ? '#1e1e24' : '#ffffff', 
                          border: dark ? '1px solid #f59e0b' : '1px solid #d97706', 
                          color: dark ? '#fbbf24' : '#92400e', 
                          fontWeight: 700, 
                          padding: '8px 16px', 
                          borderRadius: '8px', 
                          fontSize: '12px', 
                          cursor: 'pointer' 
                        }}
                      >
                        ✕ Cancelar Edição (Voltar para Novo)
                      </button>
                    </div>
                  </div>
                )}

                {/* PRODUCT FORM CARD */}
                <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '20px', border: '1px solid var(--line)', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                      {editingId ? 'Salvar Edição do Produto' : 'Cadastrar Novo Notebook / Produto'}
                    </h2>
                    {editingId && (
                      <span style={{ 
                        background: dark ? 'rgba(245, 158, 11, 0.25)' : '#fef3c7', 
                        color: dark ? '#fbbf24' : '#92400e', 
                        border: dark ? '1px solid rgba(245, 158, 11, 0.35)' : 'none',
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: 700 
                      }}>
                        MODO DE EDIÇÃO
                      </span>
                    )}
                  </div>

                  {formSuccess && (
                    <div style={{ 
                      padding: '12px 16px', 
                      borderRadius: '10px', 
                      background: dark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', 
                      color: dark ? '#34d399' : '#047857', 
                      border: dark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #a7f3d0',
                      fontSize: '13px', 
                      fontWeight: 600, 
                      marginBottom: '20px' 
                    }}>
                      ✓ {formSuccess}
                    </div>
                  )}
                  {formError && (
                    <div style={{ 
                      padding: '12px 16px', 
                      borderRadius: '10px', 
                      background: dark ? 'rgba(239, 68, 68, 0.15)' : '#ffeef0', 
                      color: dark ? '#f87171' : '#d92d20', 
                      border: dark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                      fontSize: '13px', 
                      fontWeight: 600, 
                      marginBottom: '20px' 
                    }}>
                      ⚠ {formError}
                    </div>
                  )}

                  <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '20px' }}>
                    {/* Title */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Título Completo do Notebook / Produto:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: Dell Inspiron 15 • Core i5 11ª Ger • 16GB RAM • SSD 512GB NVMe"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                      />
                    </div>

                    {/* Price and Installment generation */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Preço à Vista no Pix / Dinheiro (R$):
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        required
                        placeholder="Ex.: 2490 ou 2.490,00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700 }}>
                          Condições de Parcelamento (Cartão):
                        </label>
                        <button
                          type="button"
                          onClick={handleAutoFillInstallments}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: dark ? '#ffd438' : '#876c00',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0
                          }}
                        >
                          ⚡ Gerar com taxas da maquininha
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Ex.: ou em até 12x no cartão"
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                      />
                    </div>

                    {/* Category, Condition, Warranty */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Categoria:
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                      >
                        {[...new Set([...CATEGORIES, category])].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Condição:
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                      >
                        {[...new Set([...CONDITIONS, condition])].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Warranty Period (Customizable) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Tempo de Garantia da Loja:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={warranty}
                          onChange={(e) => setWarranty(e.target.value)}
                          style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                        >
                          {WARRANTIES.map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                          <option value="Personalizada">Personalizada…</option>
                        </select>
                        {warranty === 'Personalizada' && (
                          <input
                            type="text"
                            placeholder="Ex.: 90 dias balcão"
                            value={customWarranty}
                            onChange={(e) => setCustomWarranty(e.target.value)}
                            style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Model */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Modelo Específico:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex.: Inspiron 3520 ou MacBook Pro M1"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                      />
                    </div>

                    {/* Photo Upload */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Foto do Produto:
                      </label>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          style={{ fontSize: '13px' }}
                        />
                        {uploadingImage && <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Enviando imagem…</span>}
                        {imageUrl && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={imageUrl} alt="Preview" style={{ width: '60px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--line)' }} />
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Foto carregada</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Specs */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: 'var(--muted)' }}>
                        Processador (CPU):
                      </label>
                      <input
                        type="text"
                        placeholder="Ex.: Intel Core i5 11ª Ger"
                        value={cpu}
                        onChange={(e) => setCpu(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: 'var(--muted)' }}>
                        Memória RAM:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex.: 16GB DDR4"
                        value={ram}
                        onChange={(e) => setRam(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: 'var(--muted)' }}>
                        Armazenamento (SSD/HD):
                      </label>
                      <input
                        type="text"
                        placeholder="Ex.: SSD 512GB NVMe"
                        value={storage}
                        onChange={(e) => setStorage(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: 'var(--muted)' }}>
                        Tela / Polegadas:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex.: 15.6 Full HD IPS"
                        value={screen}
                        onChange={(e) => setScreen(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '13px' }}
                      />
                    </div>

                    {/* Description */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Descrição e Observações:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Conte sobre o estado de conservação, bateria, acompanha carregador original, procedência, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px', fontFamily: 'inherit' }}
                      />
                    </div>

                    {/* LIVE CARD SIMULATOR PREVIEW IN FORM */}
                    {numericFormPrice > 0 && (
                      <div style={{ gridColumn: '1 / -1', background: 'var(--paper)', padding: '20px', borderRadius: '16px', border: '1px dashed var(--line)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                          PRÉVIA DO SIMULADOR DE CARTÃO (COMO O CLIENTE VERÁ NO SITE):
                        </span>
                        <CreditCardSimulator 
                          price={numericFormPrice} 
                          rates={rates} 
                          productTitle={title} 
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
                      <button 
                        type="submit" 
                        disabled={saving || uploadingImage} 
                        className="button button-yellow" 
                        style={{ padding: '14px 28px', fontSize: '14px' }}
                      >
                        {editingId ? '💾 Salvar Alterações no Produto' : '+ Cadastrar no Estoque'}
                      </button>

                      {editingId && (
                        <button 
                          type="button" 
                          className="quiet-button" 
                          onClick={resetForm}
                          style={{ padding: '12px 18px', fontSize: '13px' }}
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* PRODUCTS LIST */}
                <div style={{ background: 'var(--white)', padding: '28px', borderRadius: '20px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>
                      Notebooks e Produtos Cadastrados ({productList.length})
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Clique em <b>Editar</b> para alterar dados, preço, garantia ou fotos.
                    </span>
                  </div>

                  {productList.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Nenhum produto cadastrado no banco de dados.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {productList.map((p) => {
                        const img = (Array.isArray(p.images) && p.images[0]) || p.image;
                        const isSold = p.status === 'sold';
                        const isCurrentlyEditing = editingId === p.id;

                        return (
                          <div 
                            key={p.id}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              padding: '16px 20px', 
                              background: isCurrentlyEditing ? (dark ? 'rgba(245, 158, 11, 0.18)' : 'rgba(245, 158, 11, 0.12)') : (isSold ? (dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)') : 'var(--paper)'), 
                              borderRadius: '14px', 
                              border: isCurrentlyEditing ? '2px solid #f59e0b' : '1px solid var(--line)',
                              opacity: isSold ? 0.65 : 1,
                              flexWrap: 'wrap',
                              gap: '14px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 'min(100%, 240px)', flex: 1 }}>
                              {img ? (
                                <img src={img} alt="" style={{ width: '64px', height: '52px', objectFit: 'cover', borderRadius: '8px' }} />
                              ) : (
                                <div style={{ width: '64px', height: '52px', background: dark ? '#18181c' : '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: dark ? '#a1a1aa' : '#64748b' }}>
                                  Sem foto
                                </div>
                              )}
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>{p.title}</strong>
                                  {isCurrentlyEditing && (
                                    <span style={{ background: '#f59e0b', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                                      EDITANDO AGORA
                                    </span>
                                  )}
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginTop: '2px' }}>
                                  {p.category} · {p.condition || 'Seminovo'} · Garantia: <b>{p.warranty || '3 Meses'}</b> · 
                                  <strong style={{ color: 'var(--ink)', marginLeft: '6px' }}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(p.price) || 0)}
                                  </strong>
                                  {isSold && <b style={{ color: dark ? '#f87171' : '#dc2626', marginLeft: '8px' }}>[VENDIDO]</b>}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <button 
                                type="button"
                                className="quiet-button"
                                style={{ fontSize: '12px', padding: '8px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: dark ? '#18181c' : '#ffffff', color: 'var(--ink)' }}
                                onClick={() => handleToggleSold(p)}
                              >
                                {isSold ? 'Marcar Disponível' : 'Marcar Vendido'}
                              </button>

                              <button 
                                type="button"
                                style={{ 
                                  fontSize: '12px', 
                                  padding: '8px 16px', 
                                  background: isCurrentlyEditing ? '#f59e0b' : (dark ? '#22222a' : '#17201f'), 
                                  color: isCurrentlyEditing ? '#ffffff' : '#ffd438', 
                                  border: dark ? '1px solid #33333e' : 'none', 
                                  borderRadius: '8px', 
                                  fontWeight: 700, 
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onClick={() => handleEdit(p)}
                              >
                                ✏️ Editar
                              </button>

                              <button 
                                type="button"
                                style={{ 
                                  fontSize: '12px', 
                                  padding: '8px 14px', 
                                  border: dark ? '1px solid rgba(220, 38, 38, 0.35)' : '1px solid #fee2e2', 
                                  color: dark ? '#f87171' : '#dc2626', 
                                  background: dark ? 'rgba(220, 38, 38, 0.12)' : '#fff', 
                                  borderRadius: '8px', 
                                  cursor: 'pointer' 
                                }}
                                onClick={() => handleDelete(p.id)}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: CARD MACHINE RATES (TAXAS DA MAQUININHA) */}
            {activeTab === 'rates' && (
              <div>
                <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '20px', border: '1px solid var(--line)', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: dark ? '#ffd438' : '#876c00', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                        CONFIGURAÇÃO DE PAGAMENTO
                      </span>
                      <h2 style={{ margin: '4px 0 6px 0', fontSize: '24px', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                        Taxas da Maquininha da Empresa
                      </h2>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)', maxWidth: '680px' }}>
                        Cadastre aqui as taxas de juros e parcelamento da sua maquininha. O simulador em formato de cartão em todo o site calculará automaticamente as parcelas de acordo com estas taxas cadastradas.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveRates}
                      disabled={ratesSaving}
                      className="button button-yellow"
                      style={{ padding: '14px 28px', fontSize: '14px' }}
                    >
                      {ratesSaving ? 'Salvando…' : '💾 Salvar Taxas da Maquininha'}
                    </button>
                  </div>

                  {ratesSuccess && (
                    <div style={{ 
                      padding: '14px 18px', 
                      borderRadius: '10px', 
                      background: dark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', 
                      color: dark ? '#34d399' : '#047857', 
                      border: dark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #a7f3d0',
                      fontSize: '13px', 
                      fontWeight: 700, 
                      marginBottom: '20px' 
                    }}>
                      ✓ {ratesSuccess}
                    </div>
                  )}
                  {ratesError && (
                    <div style={{ 
                      padding: '14px 18px', 
                      borderRadius: '10px', 
                      background: dark ? 'rgba(239, 68, 68, 0.15)' : '#ffeef0', 
                      color: dark ? '#f87171' : '#d92d20', 
                      border: dark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                      fontSize: '13px', 
                      fontWeight: 700, 
                      marginBottom: '20px' 
                    }}>
                      ⚠ {ratesError}
                    </div>
                  )}

                  {/* Presets Bar */}
                  <div style={{ background: 'var(--paper)', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--line)', marginBottom: '28px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '10px', color: 'var(--ink)' }}>
                      ⚡ Preenchimento Rápido por Modelo de Maquininha:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Object.entries(RATE_PRESETS).map(([key, preset]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleApplyPreset(key)}
                          style={{
                            padding: '9px 15px',
                            borderRadius: '8px',
                            border: dark ? '1px solid #2a2a35' : '1px solid var(--line)',
                            background: dark ? '#1a1a20' : '#ffffff',
                            color: dark ? '#f4f4f5' : '#17201f',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffd438'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = dark ? '#2a2a35' : 'var(--line)'; }}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Machine Details Form */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                        Nome da Maquininha:
                      </label>
                      <input
                        type="text"
                        value={rates.machineName || ''}
                        onChange={(e) => setRates({ ...rates, machineName: e.target.value })}
                        placeholder="Ex.: Ton T3 Brother, Stone ou PagBank"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: dark ? '1px solid #272730' : '1px solid var(--line)', background: dark ? '#141418' : 'var(--paper)', color: 'var(--ink)', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                        Parcelas Sem Juros para o Cliente:
                      </label>
                      <select
                        value={rates.interestFreeInstallments || 1}
                        onChange={(e) => setRates({ ...rates, interestFreeInstallments: parseInt(e.target.value, 10) || 1 })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: dark ? '1px solid #272730' : '1px solid var(--line)', background: dark ? '#141418' : 'var(--paper)', color: 'var(--ink)', fontSize: '14px' }}
                      >
                        <option value="1">1x (Apenas à vista sem juros)</option>
                        <option value="2">Até 2x sem juros</option>
                        <option value="3">Até 3x sem juros</option>
                        <option value="4">Até 4x sem juros</option>
                        <option value="5">Até 5x sem juros</option>
                        <option value="6">Até 6x sem juros</option>
                        <option value="10">Até 10x sem juros</option>
                        <option value="12">12x Sem Juros (Absorvido pela loja)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                        Taxa Débito (%):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={rates.debit !== undefined ? rates.debit : 1.39}
                        onChange={(e) => setRates({ ...rates, debit: parseFloat(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: dark ? '1px solid #272730' : '1px solid var(--line)', background: dark ? '#141418' : 'var(--paper)', color: 'var(--ink)', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                        Taxa Crédito 1x à Vista (%):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={rates.credit1x !== undefined ? rates.credit1x : 3.15}
                        onChange={(e) => setRates({ ...rates, credit1x: parseFloat(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: dark ? '1px solid #272730' : '1px solid var(--line)', background: dark ? '#141418' : 'var(--paper)', color: 'var(--ink)', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  {/* Table of Installment Rates */}
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--ink)' }}>
                    Tabela de Taxas por Parcela (1x até 12x / 18x)
                  </h3>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--muted)' }}>
                    Informe a taxa total percentual cobrada pela maquininha para cada número de parcelas:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 125px), 1fr))', gap: '12px', marginBottom: '32px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18].map((n) => {
                      const key = String(n);
                      const currentVal = rates.installments?.[key] !== undefined ? rates.installments[key] : (3.15 + (n - 1) * 0.9);
                      const isFree = n <= (rates.interestFreeInstallments || 1);

                      return (
                        <div 
                          key={n} 
                          style={{ 
                            background: isFree 
                              ? (dark ? 'rgba(34, 197, 94, 0.12)' : '#f0fdf4') 
                              : 'var(--paper)', 
                            padding: '12px', 
                            borderRadius: '10px', 
                            border: isFree 
                              ? (dark ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid #bbf7d0') 
                              : (dark ? '1px solid #272730' : '1px solid var(--line)') 
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{n}x</strong>
                            {isFree && (
                              <span style={{ fontSize: '9px', fontWeight: 800, color: dark ? '#4ade80' : '#16a34a' }}>
                                SEM JUROS
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              step="0.01"
                              value={currentVal}
                              onChange={(e) => handleRateChange(key, e.target.value)}
                              style={{ 
                                width: '100%', 
                                padding: '8px 10px', 
                                borderRadius: '6px', 
                                border: dark ? '1px solid #272730' : '1px solid var(--line)', 
                                background: dark ? '#141418' : '#ffffff', 
                                color: 'var(--ink)',
                                fontSize: '13px', 
                                fontWeight: 700 
                              }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* TEST SANDBOX SIMULATOR */}
                  <div style={{ background: 'var(--paper)', padding: '24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <strong style={{ fontSize: '14px', display: 'block', color: 'var(--ink)' }}>
                          🔬 Testador em Tempo Real da Maquininha:
                        </strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          Simule um valor qualquer para ver como o cliente verá o cartão e o parcelamento com as taxas acima.
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Valor de Teste: R$</span>
                        <input
                          type="text"
                          value={ratesTestPrice}
                          onChange={(e) => setRatesTestPrice(e.target.value)}
                          placeholder="2490"
                          style={{ 
                            width: '120px', 
                            padding: '8px 12px', 
                            borderRadius: '8px', 
                            border: dark ? '1px solid #272730' : '1px solid var(--line)', 
                            background: dark ? '#141418' : '#ffffff', 
                            color: 'var(--ink)',
                            fontSize: '14px', 
                            fontWeight: 700 
                          }}
                        />
                      </div>
                    </div>

                    <CreditCardSimulator 
                      price={parsePriceInput(ratesTestPrice)} 
                      rates={rates} 
                      productTitle="Exemplo de Notebook"
                      showFullTable={true}
                    />
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleSaveRates}
                      disabled={ratesSaving}
                      className="button button-yellow"
                      style={{ padding: '14px 32px', fontSize: '14px' }}
                    >
                      {ratesSaving ? 'Salvando…' : '💾 Salvar e Aplicar Taxas no Catálogo'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

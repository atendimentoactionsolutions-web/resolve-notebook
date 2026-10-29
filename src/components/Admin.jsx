import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Notebook', 'MacBook', 'SSD', 'Memória RAM', 'Acessório', 'Outro'];
const CONDITIONS = ['Revisado', 'Seminovo', 'Novo'];

export default function Admin({ onNavigate }) {
  const [token, setToken] = useState(localStorage.getItem('resolve_admin_token') || '');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [installments, setInstallments] = useState('ou em até 12x no cartão');
  const [category, setCategory] = useState('Notebook');
  const [condition, setCondition] = useState('Revisado');
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
          username: usernameInput, 
          password: passwordInput 
        })
      });
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

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.products || []);
        setProducts(list);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
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

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormSuccess('');
    setFormError('');

    const payload = {
      title,
      price: Number(price) || 0,
      installments,
      category,
      condition,
      badge: condition,
      specs: { cpu, ram, storage, screen },
      description,
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      status: 'available'
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

      if (res.ok) {
        setFormSuccess(editingId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
        resetForm();
        loadProducts();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Erro ao salvar produto.');
      }
    } catch (err) {
      setFormError('Erro ao comunicar com o servidor.');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setPrice(String(p.price || (p.priceCents ? p.priceCents / 100 : '')));
    setInstallments(p.installments || 'ou em até 12x no cartão');
    setCategory(p.category || 'Notebook');
    setCondition(p.condition || p.badge || 'Revisado');
    setCpu(p.specs?.cpu || '');
    setRam(p.specs?.ram || '');
    setStorage(p.specs?.storage || '');
    setScreen(p.specs?.screen || '');
    setDescription(p.description || '');
    const img = (Array.isArray(p.images) && p.images[0]) || p.image || '';
    setImageUrl(img);
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
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
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
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setInstallments('ou em até 12x no cartão');
    setCategory('Notebook');
    setCondition('Revisado');
    setCpu('');
    setRam('');
    setStorage('');
    setScreen('');
    setDescription('');
    setImageUrl('');
  };

  // Metrics
  const productList = Array.isArray(products) ? products : [];
  const totalStock = productList.length;
  const availableCount = productList.filter(p => p.status !== 'sold').length;
  const soldCount = productList.filter(p => p.status === 'sold').length;
  const totalStockValue = productList
    .filter(p => p.status !== 'sold')
    .reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);

  return (
    <div className="admin-page" style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* Header */}
      <header className="store-app-header">
        <a 
          className="brand" 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
          aria-label="RESOLVE Notebook, página inicial"
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
      </header>

      {/* Main Content */}
      <main className="wrap" style={{ padding: '40px 0 80px 0' }}>
        {!token ? (
          /* --- VIEW 1: LOGIN --- */
          <div className="auth-main" style={{ maxWidth: '440px', margin: '40px auto', background: 'var(--white)', padding: '36px 32px', borderRadius: '20px', border: '1px solid var(--line)', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <img 
              src="/assets/logo-original.png" 
              alt="RESOLVE Notebook" 
              width="54" 
              height="54" 
              style={{ borderRadius: '50%', margin: '0 auto 16px auto', display: 'block' }} 
            />

            <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
              RESOLVE Notebook
            </p>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Área do lojista.
            </h1>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Entre com as credenciais autorizadas para cadastrar produtos, atualizar preços e gerenciar o estoque.
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
                Entrar no Painel
              </button>
            </form>
          </div>
        ) : (
          /* --- VIEW 2: AUTHENTICATED DASHBOARD --- */
          <div>
            {/* Dashboard Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, color: 'var(--dark)' }}>
                  PAINEL DE GESTÃO DE ESTOQUE
                </p>
                <h1 style={{ margin: 0, fontSize: '32px', letterSpacing: '-0.02em' }}>
                  Gerenciador de Produtos
                </h1>
              </div>

              <button 
                type="button" 
                className="button button-yellow" 
                onClick={resetForm}
              >
                + Novo Produto
              </button>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>TOTAL NO ESTOQUE</span>
                <strong style={{ fontSize: '28px', color: 'var(--ink)' }}>{totalStock}</strong>
              </div>
              <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>DISPONÍVEIS NA LOJA</span>
                <strong style={{ fontSize: '28px', color: '#059669' }}>{availableCount}</strong>
              </div>
              <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>VENDIDOS</span>
                <strong style={{ fontSize: '28px', color: '#dc2626' }}>{soldCount}</strong>
              </div>
              <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>VALOR EM ESTOQUE</span>
                <strong style={{ fontSize: '22px', color: 'var(--ink)' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalStockValue)}
                </strong>
              </div>
            </div>

            {/* Product Form Card */}
            <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '20px', border: '1px solid var(--line)', marginBottom: '40px' }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', letterSpacing: '-0.01em' }}>
                {editingId ? 'Editar Produto' : 'Cadastrar Novo Notebook / Produto'}
              </h2>

              {formSuccess && (
                <div style={{ padding: '12px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                  {formSuccess}
                </div>
              )}
              {formError && (
                <div style={{ padding: '12px', borderRadius: '10px', background: '#ffeef0', color: '#d92d20', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Título Completo do Produto:
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

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Preço à Vista (R$):
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="Ex.: 2490"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Condições de Parcelamento:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: ou em até 12x no cartão"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Categoria:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px' }}
                  >
                    {CATEGORIES.filter(c => c !== 'Todos').map(c => (
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
                    {CONDITIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
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

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Descrição e Observações:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Conte sobre o estado de conservação, acessórios inclusos, bateria, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--paper)', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button type="submit" className="button button-yellow" style={{ padding: '12px 24px' }}>
                    {editingId ? 'Salvar Alterações' : 'Cadastrar no Estoque'}
                  </button>
                  {editingId && (
                    <button type="button" className="quiet-button" onClick={resetForm}>
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products Table / List */}
            <div style={{ background: 'var(--white)', padding: '28px', borderRadius: '20px', border: '1px solid var(--line)' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>
                Estoque Cadastrado ({productList.length})
              </h2>

              {productList.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Nenhum produto cadastrado no banco de dados.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {productList.map((p) => {
                    const img = (Array.isArray(p.images) && p.images[0]) || p.image;
                    const isSold = p.status === 'sold';

                    return (
                      <div 
                        key={p.id}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '16px', 
                          background: isSold ? '#f9fafb' : 'var(--paper)', 
                          borderRadius: '12px', 
                          border: '1px solid var(--line)',
                          opacity: isSold ? 0.65 : 1,
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px' }}>
                          {img ? (
                            <img src={img} alt="" style={{ width: '56px', height: '44px', objectFit: 'cover', borderRadius: '8px' }} />
                          ) : (
                            <div style={{ width: '56px', height: '44px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#64748b' }}>
                              Sem foto
                            </div>
                          )}
                          <div>
                            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>{p.title}</strong>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                              {p.category} · {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(p.price) || 0)}
                              {isSold && <b style={{ color: '#dc2626', marginLeft: '8px' }}>[VENDIDO]</b>}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            type="button"
                            className="quiet-button"
                            style={{ fontSize: '12px', padding: '6px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                            onClick={() => handleToggleSold(p)}
                          >
                            {isSold ? 'Marcar Disponível' : 'Marcar Vendido'}
                          </button>
                          <button 
                            type="button"
                            className="quiet-button"
                            style={{ fontSize: '12px', padding: '6px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                            onClick={() => handleEdit(p)}
                          >
                            Editar
                          </button>
                          <button 
                            type="button"
                            style={{ fontSize: '12px', padding: '6px 12px', border: '1px solid #fee2e2', color: '#dc2626', background: '#fff', borderRadius: '8px', cursor: 'pointer' }}
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
      </main>
    </div>
  );
}

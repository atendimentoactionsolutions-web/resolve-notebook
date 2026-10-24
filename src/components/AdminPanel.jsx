import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  Laptop, 
  DollarSign, 
  Package, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Save,
  LogOut
} from 'lucide-react';

export default function AdminPanel({ isOpen, onClose, onRefreshCatalog }) {
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
  const [category, setCategory] = useState('Estudo & Trabalho');
  const [badge, setBadge] = useState('Seminovo Revisado • Garantia 3 Meses');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [screen, setScreen] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  const categories = ['Estudo & Trabalho', 'Corporativo', 'Gamer', 'MacBook', 'Outro'];

  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  if (!isOpen) return null;

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
        setProducts(data);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload file directly from phone or desktop
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
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
        alert(data.error || 'Erro no upload da imagem.');
      }
    } catch (err) {
      alert('Erro de conexão no upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Preencha ao menos o título e o preço.');
      return;
    }

    const payload = {
      title,
      price: parseFloat(price) || 0,
      installments,
      category,
      badge,
      specs: {
        cpu,
        ram,
        storage,
        screen
      },
      description,
      image: imageUrl || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop',
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
        setFormSuccess(editingId ? 'Notebook atualizado!' : 'Notebook cadastrado com sucesso!');
        resetForm();
        loadProducts();
        if (onRefreshCatalog) onRefreshCatalog();
        setTimeout(() => setFormSuccess(''), 3000);
      } else {
        alert('Erro ao salvar produto.');
      }
    } catch (err) {
      alert('Erro de comunicação com o servidor.');
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setPrice(p.price);
    setInstallments(p.installments || '');
    setCategory(p.category || 'Estudo & Trabalho');
    setBadge(p.badge || '');
    setCpu(p.specs?.cpu || '');
    setRam(p.specs?.ram || '');
    setStorage(p.specs?.storage || '');
    setScreen(p.specs?.screen || '');
    setDescription(p.description || '');
    setImageUrl(p.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!confirm('Deseja realmente excluir este notebook do estoque?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadProducts();
        if (onRefreshCatalog) onRefreshCatalog();
      }
    } catch (err) {
      alert('Erro ao excluir.');
    }
  };

  const handleToggleStatus = async (p) => {
    const newStatus = p.status === 'sold' ? 'available' : 'sold';
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadProducts();
        if (onRefreshCatalog) onRefreshCatalog();
      }
    } catch (err) {
      alert('Erro ao atualizar status.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setInstallments('ou em até 12x no cartão');
    setCategory('Estudo & Trabalho');
    setBadge('Seminovo Revisado • Garantia 3 Meses');
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#10121a] border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] my-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          aria-label="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- VIEW 1: LOGIN SCREEN IF NOT AUTHENTICATED --- */}
        {!token ? (
          <div className="max-w-md mx-auto py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Painel do Lojista</h3>
              <p className="text-xs text-gray-400 mt-1">
                Acesso restrito para gerenciar estoque de notebooks da Resolve Notebook.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1 text-left">
                  Usuário:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Digite o usuário (ex: resolve)"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1 text-left">
                  Senha:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Digite a senha (ex: resolve)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition"
                />
              </div>

              {loginError && (
                <div className="text-xs text-red-400 font-medium">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm uppercase tracking-wider transition shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer"
              >
                Entrar no Painel
              </button>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
                Acesso oficial: Usuário: <strong className="text-amber-400">resolve</strong> | Senha: <strong className="text-amber-400">resolve</strong>
              </div>
            </form>
          </div>
        ) : (
          /* --- VIEW 2: AUTHENTICATED DASHBOARD & MANAGEMENT --- */
          <div className="space-y-8">
            {/* Header with Logout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Painel Conectado
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  Gerenciador de Estoque de Notebooks
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-gray-300 hover:text-white transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#151722] border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                  <Package className="w-4 h-4 text-amber-400" /> Total Cadastrados
                </div>
                <div className="text-2xl font-black text-white">{totalStock}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#151722] border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                  <Eye className="w-4 h-4 text-emerald-400" /> Disponíveis
                </div>
                <div className="text-2xl font-black text-emerald-400">{availableCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#151722] border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                  <EyeOff className="w-4 h-4 text-red-400" /> Vendidos
                </div>
                <div className="text-2xl font-black text-red-400">{soldCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#151722] border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                  <DollarSign className="w-4 h-4 text-amber-400" /> Valor em Estoque
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 truncate">
                  {totalStockValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
            </div>

            {/* Form: Add or Edit Notebook */}
            <div className="p-6 rounded-3xl bg-[#141620] border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-400" />
                  {editingId ? 'Editar Notebook' : 'Cadastrar Novo Notebook'}
                </h4>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Título do Notebook:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dell Inspiron 15 • Core i5 11ª • 16GB RAM • SSD 512GB"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Preço À Vista (R$):
                    </label>
                    <input
                      type="number"
                      required
                      step="1"
                      placeholder="Ex: 2490"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-bold placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Categoria:
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Etiqueta / Destaque:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Seminovo Revisado • Garantia 3 Meses"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  {/* Installments note */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Condição de Parcelamento:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: ou até 12x no cartão"
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Specs Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Processador:</label>
                    <input
                      type="text"
                      placeholder="Ex: Intel i5-1135G7"
                      value={cpu}
                      onChange={(e) => setCpu(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Memória RAM:</label>
                    <input
                      type="text"
                      placeholder="Ex: 16GB DDR4"
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Armazenamento:</label>
                    <input
                      type="text"
                      placeholder="Ex: SSD 512GB NVMe"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Tela:</label>
                    <input
                      type="text"
                      placeholder="Ex: 15.6' Full HD"
                      value={screen}
                      onChange={(e) => setScreen(e.target.value)}
                      className="w-full bg-[#1b1d2a] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Photo Upload and URL */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-7">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Foto do Notebook:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Cole o link da foto ou envie o arquivo ao lado..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 bg-[#1b1d2a] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-amber-400 border border-zinc-600 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Enviando...' : 'Subir Foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="sm:col-span-5 flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg bg-zinc-900 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 leading-tight">
                      {imageUrl ? 'Foto pronta para exibição no site' : 'Envie a foto tirada na loja ou da bancada'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Descrição e Estado de Conservação:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Bateria durando mais de 4 horas, sem riscos, acompanha carregador original..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#1b1d2a] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-gray-300"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm uppercase tracking-wider transition shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? 'Salvar Alterações' : 'Cadastrar Notebook'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Existing Notebooks */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Notebooks Cadastrados ({products.length})</span>
                <button
                  onClick={loadProducts}
                  className="text-xs text-amber-400 hover:underline font-normal"
                >
                  Atualizar Lista
                </button>
              </h4>

              {loading ? (
                <div className="text-center py-6 text-gray-400 text-xs">Carregando estoque...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 bg-zinc-900/50 rounded-2xl text-gray-400 text-xs">
                  Nenhum notebook cadastrado ainda. Use o formulário acima!
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((p) => {
                    const isSold = p.status === 'sold';
                    const priceFormatted = Number(p.price).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    });

                    return (
                      <div
                        key={p.id}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                          isSold 
                            ? 'bg-zinc-900/40 border-zinc-800 opacity-60' 
                            : 'bg-[#141620] border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Image */}
                          <div className="w-16 h-12 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-700">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-white truncate">{p.title}</h5>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                isSold ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {isSold ? 'Vendido' : 'Disponível'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                              <span className="font-bold text-amber-400">{priceFormatted}</span>
                              <span>•</span>
                              <span>{p.category}</span>
                              {p.specs?.cpu && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{p.specs.cpu}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                              isSold
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                            }`}
                            title={isSold ? 'Marcar como Disponível' : 'Marcar como Vendido'}
                          >
                            {isSold ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{isSold ? 'Reativar' : 'Marcar Vendido'}</span>
                          </button>

                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-amber-400 hover:text-black text-gray-300 transition"
                            title="Editar notebook"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(p.id)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500 hover:text-white text-gray-400 transition"
                            title="Excluir notebook"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
}

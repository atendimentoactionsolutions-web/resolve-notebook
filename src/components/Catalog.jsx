import React, { useState, useEffect, useMemo, useRef, useDeferredValue } from 'react';

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const CATEGORIES = ['Todos', 'Notebook', 'MacBook', 'SSD', 'Memória RAM', 'Acessório', 'Outro'];

const formatMoney = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

export default function Catalog({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeProduct, setActiveProduct] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (!activeProduct) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
    return () => {
      dialog.close();
      document.body.classList.remove('modal-open');
      previousFocus?.focus();
    };
  }, [activeProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Não foi possível carregar o catálogo.');
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      if (!Array.isArray(list)) throw new Error('Resposta inválida do catálogo.');
      setProducts(list.filter(p => p && p.status !== 'sold'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar catálogo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Check query params for initial profile/filter
    const params = new URLSearchParams(window.location.search);
    const perfil = params.get('perfil');
    if (perfil === 'macbook') {
      setSelectedCategory('MacBook');
    } else if (perfil === 'gamer') {
      setSearch('gamer');
    } else if (perfil === 'trabalho' || perfil === 'estudo') {
      setSelectedCategory('Notebook');
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pCat = normalize(p.category);
      const title = normalize(p.title);
      const isMac = /macbook|apple/.test(pCat) || title.includes('macbook');
      const isNotebook = !isMac && /notebook|trabalho|estudo|corporativo|gamer|geral/.test(pCat);
      const category = normalize(selectedCategory);
      const catMatch = selectedCategory === 'Todos' ||
        (selectedCategory === 'Notebook' ? isNotebook :
          selectedCategory === 'MacBook' ? isMac :
            selectedCategory === 'Outro' ? (!isMac && !isNotebook && !/ssd|memoria|acessorio/.test(pCat)) :
              pCat.includes(category));
      const q = normalize(deferredSearch.trim());
      const searchable = [p.title, p.description, p.category, p.badge, ...Object.values(p.specs || {})].map(normalize).join(' ');
      const textMatch = !q || searchable.includes(q);

      return catMatch && textMatch;
    });
  }, [products, selectedCategory, deferredSearch]);

  const handleOpenDetail = (p) => {
    setActiveProduct(p);
    setActivePhotoIdx(0);
    document.body.classList.add('modal-open');
  };

  const handleCloseDetail = () => {
    setActiveProduct(null);
    document.body.classList.remove('modal-open');
  };

  const generateWhatsAppLink = (product) => {
    const priceText = formatMoney(product.price || (product.priceCents ? product.priceCents / 100 : 0));
    const msg = `Olá! Vi este produto no catálogo da RESOLVE Notebook:\n\n*${product.title}*\n${priceText} (${product.installments || 'consulte parcelamento'})\n\nEle ainda está disponível? Gostaria de mais informações.`;
    return `https://wa.me/5511988095982?text=${encodeURIComponent(msg)}`;
  };

  const productImages = activeProduct ? (
    Array.isArray(activeProduct.images) && activeProduct.images.length > 0
      ? activeProduct.images
      : (activeProduct.image ? [activeProduct.image] : [])
  ) : [];

  return (
    <div className="catalog-page">
      {/* SVG Definitions */}
      <svg className="svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <symbol id="arrow" viewBox="0 0 24 24"><path d="M5 19 19 5M5 5h14v14"/></symbol>
          <symbol id="arrow-up-right" viewBox="0 0 24 24"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></symbol>
          <symbol id="refresh-cw" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></symbol>
          <symbol id="search-icon" viewBox="0 0 24 24"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></symbol>
          <symbol id="close-x" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>
          <symbol id="laptop-icon" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="13" rx="1"/><path d="m4 16-3 4h22l-3-4M9 20h6"/></symbol>
        </defs>
      </svg>

      {/* Header */}
      <header className="store-app-header">
        <a 
          className="brand" 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
          aria-label="RESOLVE Notebook, página inicial"
        >
          <img 
            src="/assets/logo-original.png" 
            alt="Logo RESOLVE" 
            width="44" 
            height="44" 
            style={{ cursor: 'pointer' }}
          />
          <span>RESOLVE<span className="brand-sub">NOTEBOOK</span></span>
        </a>

        <nav aria-label="Navegação secundária">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>
            Voltar ao site
          </a>
        </nav>

        <a 
          className="button button-dark" 
          href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20produtos%20dispon%C3%ADveis%20na%20RESOLVE%20Notebook." 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Falar no WhatsApp
        </a>
      </header>

      {/* Catalog Main Content */}
      <main className="wrap">
        <div style={{ paddingTop: '35px', paddingBottom: '10px' }}>
          <p className="hero-context" style={{ marginBottom: '8px' }}>
            RESOLVE Notebook · Santa Ifigênia
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15, margin: '0 0 12px 0', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Encontre o seu<br/>próximo notebook.
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '640px', margin: '0 0 28px 0', fontSize: '16px' }}>
            Notebooks revisados, peças e upgrades com garantia de loja física no Shopping 355.
          </p>
        </div>

        <section className="catalog-section" aria-label="Catálogo de produtos">
          {/* Tools: Search & Refresh */}
          <div className="catalog-tools">
            <div className="catalog-search">
              <svg aria-hidden="true" style={{ width: '20px', height: '20px' }}><use href="#search-icon"/></svg>
              <label className="visually-hidden" htmlFor="catalog-search">Buscar produtos</label>
              <input
                id="catalog-search"
                type="search"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busque por modelo, marca ou configuração…"
              />
              {search && (
                <button 
                  type="button" 
                  onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--muted)' }}
                  aria-label="Limpar busca"
                >
                  <svg aria-hidden="true" style={{ width: '16px', height: '16px' }}><use href="#close-x"/></svg>
                </button>
              )}
            </div>

            <button 
              className="quiet-button" 
              type="button" 
              onClick={fetchProducts} 
              disabled={loading}
            >
              <svg aria-hidden="true" style={{ width: '17px', height: '17px' }}><use href="#refresh-cw"/></svg>
              {loading ? 'Atualizando…' : 'Atualizar produtos'}
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="catalog-categories" aria-label="Categorias">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Counter */}
          <div className="catalog-results" aria-live="polite">
            {!loading && !error && (
              <span>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
              </span>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="catalog-loading" role="status">
              Carregando produtos disponíveis…
            </div>
          ) : error ? (
            <div className="empty-panel" role="alert">
              <h2>O catálogo não carregou.</h2>
              <p>{error}</p>
              <button className="button button-dark" onClick={fetchProducts}>
                Tentar novamente
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            /* Product Grid */
            <div className="product-grid">
              {filteredProducts.map((p) => {
                const img = (Array.isArray(p.images) && p.images[0]) || p.image;
                const priceFormatted = formatMoney(p.price || (p.priceCents ? p.priceCents / 100 : 0));

                return (
                  <article key={p.id} className="product-card">
                    <button 
                      className="product-open" 
                      onClick={() => handleOpenDetail(p)} 
                      aria-label={`Ver detalhes de ${p.title}`}
                    >
                      <div className="product-image">
                        {img ? (
                          <img 
                            src={img} 
                            alt={p.title} 
                            width="600" 
                            height="450" 
                            loading="lazy" 
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        ) : (
                          <svg aria-hidden="true" style={{ width: '80px', height: '80px', margin: 'auto', strokeWidth: 1 }}><use href="#laptop-icon"/></svg>
                        )}
                        {(p.featured || p.badge) && (
                          <span className="featured-label">
                            {p.badge || 'Revisado'}
                          </span>
                        )}
                      </div>

                      <div className="product-card-head">
                        <span>{p.category || 'Notebook'}</span>
                        <span>{p.condition || 'Revisado'}</span>
                      </div>

                      <h2>{p.title}</h2>
                    </button>

                    <p className="product-description">{p.description}</p>

                    <div className="product-price">
                      <strong>{priceFormatted}</strong>
                      {p.installments && <small>{p.installments}</small>}
                    </div>

                    <div className="product-card-actions">
                      <button className="quiet-button" onClick={() => handleOpenDetail(p)}>
                        Ver detalhes
                      </button>
                      <a 
                        className="button button-yellow" 
                        href={generateWhatsAppLink(p)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Tenho interesse <svg aria-hidden="true" style={{ width: '17px', height: '17px' }}><use href="#arrow-up-right"/></svg>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-panel">
              <h2>{products.length ? 'Nenhum produto com esses filtros.' : 'Novos produtos chegam por aqui.'}</h2>
              <p>
                {products.length
                  ? 'Tente outro termo de busca ou escolha outra categoria.'
                  : 'No momento, os produtos estão sendo atualizados. Fale com a loja pelo WhatsApp para consultar o estoque atual.'}
              </p>
              {products.length ? (
                <button className="button button-dark" onClick={() => { setSearch(''); setSelectedCategory('Todos'); }}>
                  Limpar filtros
                </button>
              ) : (
                <a 
                  className="button button-yellow" 
                  href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Quais%20notebooks%20est%C3%A3o%20dispon%C3%ADveis%20na%20RESOLVE%20Notebook%3F" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Consultar a loja <svg aria-hidden="true" style={{ width: '18px', height: '18px' }}><use href="#arrow-up-right"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Product Detail Modal */}
          {activeProduct && (
            <dialog 
              ref={dialogRef}
              className="product-dialog" 
              onCancel={() => setActiveProduct(null)}
              aria-labelledby="product-dialog-title"
              onClick={(e) => {
                if (e.target.classList.contains('product-dialog')) handleCloseDetail();
              }}
            >
              <button 
                className="product-dialog-close icon-button" 
                onClick={handleCloseDetail} 
                aria-label="Fechar detalhes"
              >
                <svg aria-hidden="true" style={{ width: '23px', height: '23px' }}><use href="#close-x"/></svg>
              </button>

              <div className="product-detail-grid">
                <div>
                  <div className="product-detail-image">
                    {productImages.length > 0 ? (
                      <img 
                        src={productImages[activePhotoIdx] || productImages[0]} 
                        alt={`${activeProduct.title} foto ${activePhotoIdx + 1}`} 
                        width="800" 
                        height="650" 
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : (
                      <svg aria-hidden="true" style={{ width: '100px', height: '100px', margin: 'auto' }}><use href="#laptop-icon"/></svg>
                    )}
                  </div>

                  {productImages.length > 1 && (
                    <div className="product-thumbnails">
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          aria-label={`Ver foto ${idx + 1}`}
                          aria-pressed={activePhotoIdx === idx}
                          onClick={() => setActivePhotoIdx(idx)}
                        >
                          <img src={img} alt="" width="90" height="75" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="product-detail-copy">
                  <p>{activeProduct.category} · {activeProduct.condition || activeProduct.badge || 'Revisado'}</p>
                  <h2 id="product-dialog-title">{activeProduct.title}</h2>

                  <div className="product-price">
                    <strong>{formatMoney(activeProduct.price || (activeProduct.priceCents ? activeProduct.priceCents / 100 : 0))}</strong>
                    {activeProduct.installments && <small>{activeProduct.installments}</small>}
                  </div>

                  {activeProduct.specs && Object.keys(activeProduct.specs).length > 0 && (
                    <div style={{ margin: '16px 0', padding: '14px', background: 'var(--paper)', borderRadius: '12px', fontSize: '13px', lineHeight: 1.6 }}>
                      {activeProduct.specs.cpu && <div><strong>Processador:</strong> {activeProduct.specs.cpu}</div>}
                      {activeProduct.specs.ram && <div><strong>Memória:</strong> {activeProduct.specs.ram}</div>}
                      {activeProduct.specs.storage && <div><strong>Armazenamento:</strong> {activeProduct.specs.storage}</div>}
                      {activeProduct.specs.screen && <div><strong>Tela:</strong> {activeProduct.specs.screen}</div>}
                    </div>
                  )}

                  <p className="product-full-description">
                    {activeProduct.description || 'Fale com nossa equipe para conhecer as características deste produto.'}
                  </p>

                  <a 
                    className="button button-yellow" 
                    href={generateWhatsAppLink(activeProduct)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Consultar pelo WhatsApp <svg aria-hidden="true" style={{ width: '18px', height: '18px' }}><use href="#arrow-up-right"/></svg>
                  </a>

                  <small className="availability-note">
                    Confirme a disponibilidade e as condições com a loja antes de comprar.
                  </small>
                </div>
              </div>
            </dialog>
          )}
        </section>
      </main>

      {/* Catalog Footer */}
      <footer className="catalog-footer">
        <span>RESOLVE Notebook · Rua Santa Ifigênia, 361 — Loja 14</span>
        <a 
          href="/admin" 
          className="admin-access-link"
          onClick={(e) => { e.preventDefault(); onNavigate('/admin'); }}
        >
          Acessar painel ADM
        </a>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef, useDeferredValue } from 'react';
import CreditCardSimulator from './CreditCardSimulator';
import { calculateInstallments, formatMoney, DEFAULT_RATES } from '../utils/cardCalculator';

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Catalog({ onNavigate, isDark, onToggleDark }) {
  const [products, setProducts] = useState([]);
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const availableCategories = useMemo(() => {
    const cats = new Set();
    products.forEach(p => {
      if (p.category && p.category.trim()) cats.add(p.category.trim());
    });
    const list = Array.from(cats);
    if (list.length > 1) {
      return ['Todos', ...list];
    }
    return list;
  }, [products]);
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

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        setRates(data);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchRates();

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

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

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
    const modelOrTitle = product.model || product.title;
    const msg = `Olá! Vi o *${modelOrTitle}* no catálogo da Resolve Notebook e tenho interesse nele. Ainda está disponível na loja?`;
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
          aria-label="Resolve Notebook, página inicial"
        >
          <img 
            src="/assets/logo-original.png" 
            alt="Logo Resolve Notebook" 
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

          <a 
            className="button button-dark" 
            href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20produtos%20dispon%C3%ADveis%20na%20Resolve%20Notebook." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      {/* Catalog Main Content */}
      <main className="wrap">
        <div style={{ paddingTop: '35px', paddingBottom: '10px' }}>
          <p className="hero-context" style={{ marginBottom: '8px' }}>
            Resolve Notebook · Santa Ifigênia
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15, margin: '0 0 12px 0', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Encontre o seu<br/>próximo notebook.
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '640px', margin: '0 0 28px 0', fontSize: '16px' }}>
            Notebooks revisados, peças e upgrades com garantia de loja física no Shopping 355.
          </p>
        </div>

        <section className="catalog-section" aria-label="Catálogo de produtos">
          {/* Se houver apenas 1 unidade no estoque, apresente-a com destaque antes dos filtros */}
          {products.length === 1 && !loading && (
            <div style={{ marginBottom: '32px', background: 'var(--white)', padding: '24px', borderRadius: '18px', border: '1.5px solid var(--line)' }}>
              <span className="featured-label" style={{ position: 'static', display: 'inline-block', marginBottom: '14px' }}>
                Única unidade disponível no estoque
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) 1fr', gap: '28px', alignItems: 'center' }}>
                <div style={{ background: isDark ? '#000000' : '#edf1ef', border: isDark ? '1px solid #222228' : 'none', borderRadius: '12px', height: '220px', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                  {((Array.isArray(products[0].images) && products[0].images[0]) || products[0].image) ? (
                    <img 
                      src={(Array.isArray(products[0].images) && products[0].images[0]) || products[0].image} 
                      alt={products[0].title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <svg aria-hidden="true" style={{ width: '64px', height: '64px', color: 'var(--muted)' }}><use href="#laptop-icon"/></svg>
                  )}
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', margin: '0 0 10px 0', lineHeight: 1.3 }}>{products[0].title}</h2>
                  <div style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 16px 0' }}>
                    {formatMoney(products[0].price || (products[0].priceCents ? products[0].priceCents / 100 : 0))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="button button-dark" onClick={() => handleOpenDetail(products[0])} style={{ minHeight: '44px', padding: '10px 18px', fontSize: '13px' }}>
                      Ver ficha técnica
                    </button>
                    <a className="button button-yellow" href={generateWhatsAppLink(products[0])} target="_blank" rel="noopener noreferrer" style={{ minHeight: '44px', padding: '10px 18px', fontSize: '13px' }}>
                      Tenho interesse <svg aria-hidden="true" style={{ width: '16px', height: '16px' }}><use href="#arrow-up-right"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            {availableCategories.map((cat) => (
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
                const numericPrice = p.price || (p.priceCents ? p.priceCents / 100 : 0);
                const priceFormatted = formatMoney(numericPrice);
                const sims = calculateInstallments(numericPrice, rates);
                const sim12 = sims.length > 0 ? sims[sims.length - 1] : null;

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
                            {p.badge || 'Seminovo'}
                          </span>
                        )}
                      </div>

                      <div className="product-card-head">
                        <span>{p.category || 'Notebook'}</span>
                        <span>{p.condition || 'Seminovo'}</span>
                      </div>

                      <h2>{p.title}</h2>
                    </button>

                    <p className="product-description">{p.description}</p>

                    <div className="product-price" style={{ margin: '14px 0 12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <strong style={{ fontSize: '24px' }}>{priceFormatted}</strong>
                        <span className="pix-cash-badge" style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>à vista no Pix</span>
                      </div>
                      {sim12 && (
                        <div style={{ fontSize: '12px', color: 'var(--ink)', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '14px', height: '14px', stroke: '#ffd438', fill: 'none', strokeWidth: 2, flexShrink: 0 }}>
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                          </svg>
                          <span>ou <strong>{sim12.installment}x de {formatMoney(sim12.installmentValue)}</strong> no cartão</span>
                        </div>
                      )}
                      {p.warranty && (
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '13px', height: '13px', stroke: '#ffd438', fill: 'none', strokeWidth: 2, flexShrink: 0 }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span>Garantia de <b>{p.warranty}</b></span>
                        </div>
                      )}
                    </div>

                    <div className="product-card-actions">
                      <button 
                        className="quiet-button" 
                        onClick={() => handleOpenDetail(p)}
                        style={{ fontSize: '12px', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        <span>Simular cartão</span>
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
                  href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Quais%20notebooks%20est%C3%A3o%20dispon%C3%ADveis%20na%20Resolve%20Notebook%3F" 
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
                  <p>{activeProduct.category} · {activeProduct.condition || activeProduct.badge || 'Seminovo'}</p>
                  <h2 id="product-dialog-title">{activeProduct.title}</h2>

                  <div className="product-price" style={{ margin: '14px 0 10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <strong style={{ fontSize: '28px' }}>{formatMoney(activeProduct.price || (activeProduct.priceCents ? activeProduct.priceCents / 100 : 0))}</strong>
                      <span className="pix-cash-badge" style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>à vista no Pix / Dinheiro</span>
                    </div>
                  </div>

                  {/* REALISTIC CREDIT CARD SIMULATION WIDGET */}
                  <CreditCardSimulator 
                    price={activeProduct.price || (activeProduct.priceCents ? activeProduct.priceCents / 100 : 0)} 
                    rates={rates} 
                    productTitle={activeProduct.title} 
                  />

                  <div style={{ margin: '16px 0', padding: '16px', background: 'var(--paper)', borderRadius: '14px', fontSize: '13px', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>
                      <span style={{ color: '#a1a1aa', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '14px', height: '14px', stroke: '#ffd438', fill: 'none', strokeWidth: 2 }}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <strong style={{ color: '#ffffff' }}>Garantia Loja Física:</strong>
                      </span>
                      <span style={{ fontWeight: 700, color: '#ffd438' }}>{activeProduct.warranty || activeProduct.specs?.warranty || '3 Meses'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>
                      <span style={{ color: '#a1a1aa', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '14px', height: '14px', stroke: '#ffd438', fill: 'none', strokeWidth: 2 }}>
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        <strong style={{ color: '#ffffff' }}>Condição:</strong>
                      </span>
                      <span style={{ fontWeight: 700, color: '#f4f4f5' }}>{activeProduct.condition || 'Seminovo Impecável'}</span>
                    </div>
                    {activeProduct.model && <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}><span style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Modelo:</strong></span><span style={{ color: '#f4f4f5' }}>{activeProduct.model}</span></div>}
                    {(activeProduct.specs?.cpu || activeProduct.specs?.processor) && <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}><span style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Processador:</strong></span><span style={{ color: '#f4f4f5' }}>{activeProduct.specs?.cpu || activeProduct.specs?.processor}</span></div>}
                    {activeProduct.specs?.ram && <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}><span style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Memória RAM:</strong></span><span style={{ color: '#f4f4f5' }}>{activeProduct.specs?.ram}</span></div>}
                    {(activeProduct.specs?.ssd || activeProduct.specs?.storage) && <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}><span style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>SSD / Armazenamento:</strong></span><span style={{ color: '#f4f4f5' }}>{activeProduct.specs?.ssd || activeProduct.specs?.storage}</span></div>}
                    {activeProduct.specs?.screen && <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}><span style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Tela:</strong></span><span style={{ color: '#f4f4f5' }}>{activeProduct.specs?.screen}</span></div>}
                    {(activeProduct.battery || activeProduct.specs?.battery) && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Bateria:</strong></span><span style={{ color: '#f4f4f5' }}>{activeProduct.battery || activeProduct.specs?.battery}</span></div>}
                  </div>

                  <p className="product-full-description" style={{ color: '#d4d4d8', margin: '14px 0 20px', fontSize: '13px', lineHeight: 1.7 }}>
                    {activeProduct.description || 'Fale com nossa equipe para conhecer as características deste produto.'}
                  </p>

                  <a 
                    className="button button-yellow" 
                    href={generateWhatsAppLink(activeProduct)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Consultar pelo WhatsApp <svg aria-hidden="true" style={{ width: '18px', height: '18px' }}><use href="#arrow-up-right"/></svg>
                  </a>

                  <small className="availability-note" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: '#a1a1aa', fontSize: '11px' }}>
                    Confirme a disponibilidade e passe seu cartão em nossa loja na Santa Ifigênia, 361.
                  </small>
                </div>
              </div>
            </dialog>
          )}
        </section>
      </main>

      {/* Catalog Footer */}
      <footer className="catalog-footer" style={{ background: '#000000', borderTop: '1px solid #1e1e24', color: '#a1a1aa' }}>
        <span>Resolve Notebook · Rua Santa Ifigênia, 361 — Loja 14</span>
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

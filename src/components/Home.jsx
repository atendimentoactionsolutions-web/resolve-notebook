import React, { useState, useEffect, useMemo, useRef, useDeferredValue } from 'react';
import { FULL_SERVICES_CATALOG } from '../data/siteConfig';
import useScrollReveal from '../hooks/useScrollReveal';
import { getRepairQuestions, buildRepairMessage } from '../data/repairQuestions';
import GoogleReviews from './GoogleReviews';

const issueNames = [
  'Não liga ou não carrega',
  'Tela quebrada ou sem imagem',
  'Lento, travando ou esquentando',
  'Carcaça ou dobradiça quebrada',
  'Bateria dura pouco',
  'Teclado ou sistema com falhas',
  'Contato com líquido',
  'Outro problema'
];



const useContent = {
  Trabalho: {
    heading: 'Um parceiro para<br>o dia render.',
    desc: 'Reuniões, planilhas, projetos e muitas abas abertas. Encontre a configuração que acompanha a sua rotina.',
    profile: 'trabalho'
  },
  Estudo: {
    heading: 'Foco no que<br>você quer aprender.',
    desc: 'Aulas, pesquisas, trabalhos e novos projetos. Conte seu curso e sua rotina para encontrar um notebook que faz sentido para você.',
    profile: 'estudo'
  },
  Gamer: {
    heading: 'Desempenho para<br>o seu próximo nível.',
    desc: 'Conte quais jogos ou programas você usa. A equipe ajuda a comparar configurações e consultar os modelos disponíveis.',
    profile: 'gamer'
  },
  MacBook: {
    heading: 'Seu próximo Mac.<br>Escolhido com cuidado.',
    desc: 'Conheça as opções de MacBook revisados. Nossa equipe orienta a escolha de acordo com o seu uso e os modelos disponíveis.',
    profile: 'macbook'
  }
};

const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Home({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  useScrollReveal(contentRef);
  const [activeUsage, setActiveUsage] = useState(() => {
    const profile = new URLSearchParams(window.location.search).get('perfil');
    return Object.keys(useContent).find(key => key.toLowerCase() === profile?.toLowerCase()) || 'Trabalho';
  });
  const [isDark, setIsDark] = useState(() => localStorage.getItem('resolve_theme') === 'dark');

  // Modo Escuro discreto e persistente
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('resolve_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('resolve_theme', 'light');
    }
  }, [isDark]);

  // Atalho imperceptível de teclado: Alt + D
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.altKey && e.key.toLowerCase() === 'd') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        setIsDark(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => () => document.body.classList.remove('modal-open'), []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        headerRef.current?.querySelector('.menu-toggle')?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1001px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menuOpen]);

  // Repair Dialog State
  const [isRepairOpen, setIsRepairOpen] = useState(false);
  const [repairStep, setRepairStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [notes, setNotes] = useState('');
  const [repairAnswers, setRepairAnswers] = useState({});
  const repairQuestions = getRepairQuestions(selectedIssue);

  // Services Dialog State
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');

  useEffect(() => {
    if (!isRepairOpen && !isServicesOpen) return;
    const previousFocus = document.activeElement;
    const dialog = document.getElementById(isServicesOpen ? 'services-dialog' : 'repair-dialog');
    const selector = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';
    const focusable = () => [...dialog.querySelectorAll(selector)].filter(element => element.getClientRects().length);
    focusable()[0]?.focus();
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener('keydown', trapFocus);
    return () => {
      dialog.removeEventListener('keydown', trapFocus);
      previousFocus?.focus();
    };
  }, [isRepairOpen, isServicesOpen, repairStep]);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState(null);

  const handleSelectUsage = (usage) => {
    setActiveUsage(usage);
    const p = usage.toLowerCase();
    const url = new URL(window.location.href);
    url.searchParams.set('perfil', p);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  };

  const openRepairModal = (issue = '') => {
    setMenuOpen(false);
    setRepairAnswers({});
    if (issue) {
      setSelectedIssue(issue);
      setRepairStep(2);
    } else {
      setSelectedIssue('');
      setRepairStep(1);
    }
    setIsRepairOpen(true);
    document.body.classList.add('modal-open');
  };

  const closeRepairModal = () => {
    setIsRepairOpen(false);
    document.body.classList.remove('modal-open');
  };

  const openServicesModal = () => {
    setMenuOpen(false);
    setServiceSearch('');
    setIsServicesOpen(true);
    document.body.classList.add('modal-open');
  };

  const closeServicesModal = () => {
    setIsServicesOpen(false);
    document.body.classList.remove('modal-open');
  };

  // Fechar modals com tecla Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isServicesOpen) closeServicesModal();
        if (isRepairOpen) closeRepairModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isServicesOpen, isRepairOpen]);

  const generateWhatsAppLink = () => {
    const msg = buildRepairMessage({ issue: selectedIssue, brand, model, notes, answers: repairAnswers });
    return `https://wa.me/5511988095982?text=${encodeURIComponent(msg)}`;
  };

  const [expandedCats, setExpandedCats] = useState([]);

  const toggleCategory = (catNumber) => {
    setExpandedCats(prev => 
      prev.includes(catNumber) ? prev.filter(n => n !== catNumber) : [...prev, catNumber]
    );
  };

  const toggleAllCategories = () => {
    if (expandedCats.length === FULL_SERVICES_CATALOG.length) {
      setExpandedCats([]);
    } else {
      setExpandedCats(FULL_SERVICES_CATALOG.map(c => c.number));
    }
  };

  const deferredSearch = useDeferredValue(serviceSearch);
  const normalizedQuery = normalize(deferredSearch.trim());

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return FULL_SERVICES_CATALOG.map(cat => ({
        ...cat,
        displayItems: cat.items
      }));
    }

    return FULL_SERVICES_CATALOG.map(cat => {
      const titleMatches = normalize(cat.title).includes(normalizedQuery) || cat.number.includes(normalizedQuery);
      const matchingItems = cat.items.filter(item => normalize(item).includes(normalizedQuery));

      if (titleMatches) {
        return {
          ...cat,
          displayItems: cat.items
        };
      }

      if (matchingItems.length > 0) {
        return {
          ...cat,
          displayItems: matchingItems
        };
      }

      return null;
    }).filter(Boolean);
  }, [normalizedQuery]);

  const matchingServicesCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.displayItems.length, 0);
  }, [filteredCategories]);

  return (
    <div>
      {/* SVG Icon Definitions */}
      <svg className="svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <symbol id="arrow" viewBox="0 0 24 24"><path d="M5 19 19 5M5 5h14v14"/></symbol>
          <symbol id="right" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></symbol>
          <symbol id="pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></symbol>
          <symbol id="check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
          <symbol id="power" viewBox="0 0 24 24"><path d="M12 2v9m-5-7a9 9 0 1 0 10 0"/></symbol>
          <symbol id="screen" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="14" rx="1"/><path d="M8 21h8m-4-4v4M13 3l-4 7 5 1-3 6"/></symbol>
          <symbol id="speed" viewBox="0 0 24 24"><path d="M4 19a10 10 0 1 1 16 0M7 19h10m-5-7 5-6M5 12h2m10 0h2M12 2v3"/></symbol>
          <symbol id="laptop" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="13" rx="1"/><path d="m4 16-3 4h22l-3-4M9 20h6"/></symbol>
          <symbol id="battery" viewBox="0 0 24 24"><rect x="2" y="6" width="18" height="12" rx="2"/><path d="M23 10v4M7 9l-2 4h4l-2 3m7-6h3"/></symbol>
          <symbol id="keyboard" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M5 9h1m3 0h1m3 0h1m3 0h2M5 12h1m3 0h1m3 0h1m3 0h2M6 15h12"/></symbol>
          <symbol id="whatsapp-icon" viewBox="0 0 24 24">
            <path d="M20.8 11.9a8.8 8.8 0 0 1-13.1 7.7L2.8 21l1.4-4.8A8.8 8.8 0 1 1 20.8 11.9Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M17.05 13.9c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.16.24-.64.8-.79.96-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.13.17 1.75 2.67 4.24 3.74.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.47-.28Z" fill="currentColor" stroke="none" />
          </symbol>
          <symbol id="case" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M8 7V3h8v4M2 12h20m-12-1v3h4v-3"/></symbol>
        </defs>
      </svg>

      <a className="skip" href="#conteudo">Pular para o conteúdo</a>

      {/* Main Header */}
      <header className="header" ref={headerRef}>
        <div className="wrap header-inner">
          <a className="brand" href="#inicio" aria-label="RESOLVE Notebook, início" onClick={() => setMenuOpen(false)}>
            <img 
              src="/assets/logo-original.png" 
              alt="Logo RESOLVE" 
              width="44" 
              height="44" 
              style={{ cursor: 'pointer' }}
              title="RESOLVE Notebook"
            />
            <span>RESOLVE<span className="brand-sub">NOTEBOOK</span></span>
          </a>

          <nav id="main-nav" className={menuOpen ? 'is-open' : ''} aria-label="Navegação principal">
            <a href="#assistencia" onClick={() => setMenuOpen(false)}>Assistência</a>
            <a href="/produtos" onClick={(e) => { e.preventDefault(); onNavigate('/produtos'); setMenuOpen(false); }}>Produtos</a>
            <a href="#empresas" onClick={() => setMenuOpen(false)}>Para empresas</a>
            <a href="#loja" onClick={() => setMenuOpen(false)}>A loja</a>
          <div className="header-actions">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
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
                opacity: 0.5,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
            >
              {isDark ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <a 
              className="button button-dark header-cta" 
              href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20RESOLVE%20Notebook%20e%20gostaria%20de%20falar%20com%20um%20t%C3%A9cnico."
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Falar com um técnico <svg aria-hidden="true"><use href="#arrow"/></svg>
            </a>
          </div>
          </nav>

          <button 
            className="menu-toggle" 
            type="button"
            aria-controls="main-nav" 
            aria-expanded={menuOpen} 
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main id="conteudo" ref={contentRef}>
        {/* Section: Hero */}
        <section className="hero wrap" id="inicio">
          <div className="hero-copy">
            <p className="hero-context">Assistência especializada na Santa Ifigênia</p>
            <h1>Mais vida para<br/>o seu notebook.</h1>
            <p className="hero-intro">
              Reparos, upgrades e notebooks revisados. A solução começa com um diagnóstico claro e uma boa conversa.
            </p>
            <div className="hero-actions">
              <button className="button button-yellow" onClick={() => openRepairModal()}>
                Solicitar avaliação <svg aria-hidden="true"><use href="#arrow"/></svg>
              </button>
              <a className="text-link" href="/produtos" onClick={(e) => { e.preventDefault(); onNavigate('/produtos'); }}>
                Ver produtos disponíveis
              </a>
            </div>
          </div>

          <figure className="hero-visual">
            <img 
              className="hero-photo" 
              fetchPriority="high"
              decoding="async"
              src="/assets/repair.jpg" 
              alt="Mãos trabalhando nos componentes internos de um notebook, imagem ilustrativa" 
              width="1400" 
              height="1867"
            />
          </figure>
        </section>

        {/* Trust Line */}
        <div className="trust-line wrap">
          <p>
            <strong>Diagnóstico claro</strong>
            <span>Orçamento antes do reparo</span>
          </p>
          <p>
            <strong>De perto, de verdade</strong>
            <span>Loja física na Santa Ifigênia</span>
          </p>
          <a href="https://share.google/LUfygV4B9Dst4atvz" target="_blank" rel="noopener noreferrer">
            <strong>Quem conhece, conta.</strong>
            <span>Veja as avaliações no Google <svg aria-hidden="true"><use href="#arrow"/></svg></span>
          </a>
        </div>

        {/* Section: Assistência / Sintomas */}
        <section className="services section wrap" id="assistencia">
          <div className="section-heading">
            <div>
              <h2>O que aconteceu<br/>com seu notebook?</h2>
            </div>
            <div className="section-aside">
              <button className="text-link" onClick={openServicesModal}>
                Explorar todos os serviços <svg aria-hidden="true"><use href="#right"/></svg>
              </button>
            </div>
          </div>

          <div className="service-list">
            <button className="service-row" onClick={() => openRepairModal('Não liga ou não carrega')}>
              <svg className="service-icon" aria-hidden="true"><use href="#power"/></svg>
              <span>
                <strong>Não liga ou não carrega</strong>
                <small>Placa-mãe, conectores e circuitos de carga.</small>
              </span>
              <svg className="service-arrow" aria-hidden="true"><use href="#arrow"/></svg>
            </button>

            <button className="service-row" onClick={() => openRepairModal('Tela quebrada ou sem imagem')}>
              <svg className="service-icon" aria-hidden="true"><use href="#screen"/></svg>
              <span>
                <strong>Tela quebrada ou sem imagem</strong>
                <small>Telas, cabo flat e falhas de imagem.</small>
              </span>
              <svg className="service-arrow" aria-hidden="true"><use href="#arrow"/></svg>
            </button>

            <button className="service-row" onClick={() => openRepairModal('Lento, travando ou esquentando')}>
              <svg className="service-icon" aria-hidden="true"><use href="#speed"/></svg>
              <span>
                <strong>Lento, travando ou esquentando</strong>
                <small>SSD, memória e manutenção térmica.</small>
              </span>
              <svg className="service-arrow" aria-hidden="true"><use href="#arrow"/></svg>
            </button>

            <button className="service-row" onClick={() => openRepairModal('Carcaça ou dobradiça quebrada')}>
              <svg className="service-icon" aria-hidden="true"><use href="#laptop"/></svg>
              <span>
                <strong>Carcaça ou dobradiça quebrada</strong>
                <small>Reconstrução e recuperação da estrutura.</small>
              </span>
              <svg className="service-arrow" aria-hidden="true"><use href="#arrow"/></svg>
            </button>

            <button className="service-row" onClick={() => openRepairModal('Bateria dura pouco')}>
              <svg className="service-icon" aria-hidden="true"><use href="#battery"/></svg>
              <span>
                <strong>Bateria dura pouco</strong>
                <small>Troca de bateria e diagnóstico de autonomia.</small>
              </span>
              <svg className="service-arrow" aria-hidden="true"><use href="#arrow"/></svg>
            </button>

            <button className="service-row" onClick={() => openRepairModal('Teclado ou sistema com falhas')}>
              <svg className="service-icon" aria-hidden="true"><use href="#keyboard"/></svg>
              <span>
                <strong>Teclado ou sistema com falhas</strong>
                <small>Teclado, touchpad, sistema e dados.</small>
              </span>
              <svg className="service-arrow" aria-hidden="true"><use href="#arrow"/></svg>
            </button>
          </div>

        </section>

        {/* Section: Como Funciona */}
        <section className="process" id="como-funciona">
          <div className="wrap process-grid">
            <div className="process-intro">
              <h2>Você entende o problema.<br/>E escolhe o próximo passo.</h2>
              <p>Clareza no diagnóstico.<br/>Cuidado no reparo. Confiança na entrega.</p>
              <div className="process-image">
                <img 
                  src="/assets/notebook-detail.jpg" 
                  alt="Notebook visto de cima sobre uma mesa" 
                  width="1200" 
                  height="960"
                  loading="lazy" 
                />
              </div>
            </div>

            <ol className="steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Conte o que aconteceu.</h3>
                  <p>Fale pelo WhatsApp ou traga seu notebook à loja. Nossa equipe recebe o equipamento e entende o problema.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Decida com clareza.</h3>
                  <p>Depois da análise, você recebe o diagnóstico e o orçamento. O serviço começa com a sua aprovação.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Volte à sua rotina.</h3>
                  <p>Reparo concluído e equipamento testado. Nossa equipe explica o serviço realizado na entrega.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Section: Notebooks / Perfis de Uso */}
        <section className="notebooks section wrap" id="notebooks">
          <div className="section-heading">
            <div>
              <h2>Seu próximo notebook<br/>começa por aqui.</h2>
            </div>
          </div>

          <div className="notebook-grid">
            <figure>
              <img 
                src="/assets/laptop-workspace.jpg" 
                alt="Notebook Dell sobre uma superfície clara, imagem ilustrativa" 
                width="1024"
                height="576"
                loading="lazy" 
              />
              <figcaption>
                <span>Equipamentos revisados, escolha orientada.</span>
                <span>Imagem ilustrativa</span>
              </figcaption>
            </figure>

            <div className="notebook-picker">
              <p className="eyebrow">O que você quer fazer com ele?</p>
              
              <div className="usage-tabs" role="tablist" aria-label="Uso do notebook">
                {Object.keys(useContent).map((usage) => (
                  <button
                    key={usage}
                    id={`usage-${usage.toLowerCase()}`}
                    role="tab"
                    aria-selected={activeUsage === usage}
                    aria-controls="usage-panel"
                    tabIndex={activeUsage === usage ? 0 : -1}
                    onClick={() => handleSelectUsage(usage)}
                  >
                    {usage}
                  </button>
                ))}
              </div>

              <div id="usage-panel" role="tabpanel" aria-labelledby={`usage-${activeUsage.toLowerCase()}`} tabIndex="0">
                <h3 dangerouslySetInnerHTML={{ __html: useContent[activeUsage].heading }}></h3>
                <p>{useContent[activeUsage].desc}</p>
                <a 
                  className="button button-dark notebook-inquiry" 
                  href={`/produtos?perfil=${useContent[activeUsage].profile}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/produtos?perfil=${useContent[activeUsage].profile}`);
                  }}
                >
                  Ver produtos disponíveis <svg aria-hidden="true"><use href="#arrow"/></svg>
                </a>
                <small>
                  Modelos e disponibilidade confirmados no atendimento.<br/>
                  As imagens desta seção são ilustrativas.
                </small>
              </div>
            </div>
          </div>

          <div className="trade-in">
            <span>Seu notebook atual também pode ter um próximo capítulo.</span>
            <a 
              className="text-link" 
              href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Gostaria%20de%20vender%20meu%20notebook%20para%20a%20RESOLVE%20Notebook.%20Como%20funciona%20a%20avalia%C3%A7%C3%A3o%3F" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Quero vender meu notebook <svg aria-hidden="true"><use href="#arrow"/></svg>
            </a>
          </div>
        </section>

        {/* Section: Empresas */}
        <section className="business wrap" id="empresas">
          <div className="business-icon">
            <svg aria-hidden="true"><use href="#case"/></svg>
          </div>
          <div>
            <p className="eyebrow">Atendimento para empresas</p>
            <h2>Sua equipe trabalha.<br/>A gente cuida dos notebooks.</h2>
            <p>
              Manutenção preventiva, reparos e upgrades para os equipamentos da sua empresa. Atendimento alinhado à sua necessidade.
            </p>
            <a 
              className="text-link" 
              href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Represento%20uma%20empresa%20e%20gostaria%20de%20conversar%20sobre%20manuten%C3%A7%C3%A3o%20e%20reparos%20de%20notebooks%20corporativos%20na%20RESOLVE%20Notebook." 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Conversar sobre minha empresa <svg aria-hidden="true"><use href="#arrow"/></svg>
            </a>
          </div>
        </section>

        <GoogleReviews />

        {/* Section: Dúvidas / FAQ */}
        <section className="faq section wrap" id="duvidas">
          <div>
            <h2>Pode perguntar.</h2>
            <p>Ainda tem alguma dúvida?<br/>Fale direto com a nossa equipe.</p>
            <a 
              className="text-link" 
              href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20a%20assist%C3%AAncia%20da%20RESOLVE%20Notebook." 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Tirar uma dúvida <svg aria-hidden="true"><use href="#arrow"/></svg>
            </a>
          </div>

          <div className="faq-list">
            {[
              {
                q: 'Preciso agendar para levar meu notebook?',
                a: 'Você pode vir direto à loja, sem agendamento. Estamos na Rua Santa Ifigênia, 361, loja 14, no Shopping 355. Se preferir, fale antes pelo WhatsApp.'
              },
              {
                q: 'Quanto tempo demora o conserto?',
                a: 'O prazo depende do defeito e da disponibilidade das peças. Nossa equipe informa a previsão depois de analisar o equipamento, antes da aprovação do serviço.'
              },
              {
                q: 'O orçamento é aprovado antes do reparo?',
                a: 'Sim. Explicamos o diagnóstico e apresentamos o orçamento para a sua aprovação antes de executar o reparo.'
              },
              {
                q: 'Vocês também compram e vendem notebooks?',
                a: 'Sim. Vendemos notebooks revisados e avaliamos equipamentos para compra. Consulte modelos disponíveis e envie os detalhes do seu notebook para receber uma avaliação.'
              },
              {
                q: 'Quais são as formas de pagamento?',
                a: 'Aceitamos Pix, dinheiro e cartões. Consulte as condições de parcelamento com a equipe antes de aprovar o serviço ou a compra.'
              }
            ].map((faq, idx) => (
              <details 
                key={idx} 
                open={openFaq === idx}
              >
                <summary onClick={(e) => {
                  e.preventDefault();
                  setOpenFaq(openFaq === idx ? null : idx);
                }}>
                  {faq.q}
                  <span aria-hidden="true">{openFaq === idx ? '−' : '+'}</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Section: Loja Física */}
        <section className="store" id="loja">
          <div className="wrap">
            <div className="store-heading">
              <h2>Pode chegar.<br/>A RESOLVE é aqui.</h2>
              <p>Loja física na Santa Ifigênia.<br/>Gente de verdade para cuidar do seu notebook.</p>
            </div>
            <div className="store-info">
              <div>
                <svg aria-hidden="true"><use href="#pin"/></svg>
                <p>
                  <strong>Rua Santa Ifigênia, 361 — Loja 14</strong>
                  <span>
                    Shopping 355 · Santa Ifigênia · São Paulo, SP<br/>
                    Próximo às estações São Bento e Luz.
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <strong>Segunda a sexta, 9h às 18h</strong>
                  <span>Sábado, 9h às 15h</span>
                </p>
              </div>
              <a 
                className="button button-dark" 
                href="https://share.google/a5QyoccpiAJ3BJaKQ" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Traçar rota até a loja <svg aria-hidden="true"><use href="#arrow"/></svg>
              </a>
            </div>

            {/* Mapa Interativo Google Maps */}
            <div className="store-map" style={{
              marginTop: '32px', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              width: '100%', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              background: '#fff'
            }}>
              <iframe 
                title="Localização RESOLVE Notebook - Rua Santa Ifigênia, 361"
                src="https://maps.google.com/maps?q=Resolve%20Notebook%20Rua%20Santa%20Ifig%C3%AAnia%20361%20S%C3%A3o%20Paulo&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0, display: 'block' }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="wrap footer-top">
          <a className="brand brand-footer" href="#inicio" aria-label="RESOLVE Notebook, voltar ao início">
            <img 
              src="/assets/logo-original.png" 
              alt="RESOLVE Notebook" 
              width="44" 
              height="44" 
              style={{ cursor: 'pointer' }}
            />
            <span>RESOLVE<span className="brand-sub">NOTEBOOK</span></span>
          </a>

          <div>
            <a href="#assistencia">Assistência</a>
            <a href="/produtos" onClick={(e) => { e.preventDefault(); onNavigate('/produtos'); }}>Produtos</a>
            <a href="#empresas">Empresas</a>
            <a href="https://www.instagram.com/resolve.notebook/" target="_blank" rel="noopener noreferrer">
              Instagram <svg aria-hidden="true"><use href="#arrow"/></svg>
            </a>
          </div>

          <a className="footer-phone" href="https://wa.me/5511988095982" target="_blank" rel="noopener noreferrer">
            (11) 98809-5982 <svg aria-hidden="true"><use href="#arrow"/></svg>
          </a>
        </div>

        <div className="wrap footer-bottom">
          <span>© 2026 RESOLVE Notebook.</span>
          <span>Reparar é dar uma nova chance.</span>
          <button 
            type="button" 
            onClick={() => setIsDark(!isDark)}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            {isDark ? 'Modo claro' : 'Modo escuro'}
          </button>
          <a href="#inicio">Voltar ao topo ↑</a>
        </div>
        <div className="wrap footer-admin-access">
          <a className="admin-access-link" href="/admin" onClick={(e) => { e.preventDefault(); onNavigate('/admin'); }}>
            Acessar painel ADM
          </a>
        </div>
      </footer>

      {/* Floating WhatsApp Chat Button */}
      <a 
        className="floating-chat" 
        href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20a%20RESOLVE%20Notebook."
        aria-label="Conversar com a RESOLVE Notebook no WhatsApp" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#whatsapp-icon"/></svg>
      </a>

      {/* Modal: Repair Dialog (2 Etapas) */}
      {isRepairOpen && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRepairModal();
          }}
        >
          <div 
            id="repair-dialog" 
            role="dialog"
            aria-modal="true"
            aria-labelledby="repair-title" 
            aria-describedby="repair-description"
          >
          <div className="dialog-top">
            <span className="eyebrow">RESOLVE Notebook / Atendimento</span>
            <button className="dialog-close" onClick={closeRepairModal} aria-label="Fechar atendimento">×</button>
          </div>

          <div className="dialog-body">
            <p className="step-label" id="step-label" aria-live="polite">
              {repairStep === 1 ? 'Etapa 1 de 2 · Seu problema' : 'Etapa 2 de 2 · Seu notebook'}
            </p>
            <h2 id="repair-title">Vamos entender<br/>seu notebook.</h2>
            <p id="repair-description">Comece pelo que você percebeu. A avaliação técnica é feita pela nossa equipe.</p>

            {repairStep === 1 ? (
              <div id="repair-step-one">
                <div className="issue-options">
                  {issueNames.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => {
                        setSelectedIssue(issue);
                        setRepairAnswers({});
                        setRepairStep(2);
                      }}
                    >
                      <span>{issue}</span>
                      <svg aria-hidden="true"><use href="#arrow"/></svg>
                    </button>
                  ))}
                </div>
                <p className="dialog-footnote">Não sabe identificar? Escolha “Outro problema” e conte para a gente.</p>
              </div>
            ) : (
              <form id="repair-step-two" onSubmit={(e) => {
                e.preventDefault();
                window.open(generateWhatsAppLink(), '_blank', 'noopener,noreferrer');
                closeRepairModal();
              }}>
                <button type="button" className="back-button" onClick={() => setRepairStep(1)}>
                  ← Alterar problema
                </button>
                <div className="selected-issue">{selectedIssue}</div>

                <div className="field-grid">
                  <label>
                    Marca
                    <select 
                      name="brand" 
                      value={brand} 
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    >
                      <option value="">Selecione a marca</option>
                      <option value="Dell">Dell</option>
                      <option value="Lenovo">Lenovo</option>
                      <option value="Asus">Asus</option>
                      <option value="Acer">Acer</option>
                      <option value="HP">HP</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Apple / MacBook">Apple / MacBook</option>
                      <option value="Avell">Avell</option>
                      <option value="Outra / não sei">Outra / não sei</option>
                    </select>
                  </label>

                  <label>
                    Modelo <span>(opcional)</span>
                    <input 
                      name="model" 
                      value={model} 
                      onChange={(e) => setModel(e.target.value)}
                      maxLength={100} 
                      placeholder="Ex.: Dell Inspiron 15…" 
                    />
                  </label>
                </div>

                <fieldset className="repair-questions">
                  <legend>Sobre o problema</legend>
                  {repairQuestions.map(question => (
                    <label key={question.id}>
                      {question.label} <span>(opcional)</span>
                      <select
                        name={question.id}
                        value={repairAnswers[question.id] || ''}
                        onChange={(e) => setRepairAnswers(previous => ({ ...previous, [question.id]: e.target.value }))}
                      >
                        <option value="">Selecione uma opção</option>
                        {question.options.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                  ))}
                </fieldset>

                <label>
                  Quer contar mais alguma coisa? <span>(opcional)</span>
                  <textarea 
                    name="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={800} 
                    rows={3} 
                    placeholder="Ex.: começou ontem e a tela fica preta…" 
                  />
                </label>

                <button
                  id="repair-whatsapp" 
                  className="button button-yellow" 
                  type="submit"
                >
                  Continuar no WhatsApp <svg aria-hidden="true"><use href="#arrow"/></svg>
                </button>
                <p className="dialog-footnote">
                  Você confere e envia a mensagem no WhatsApp. Nenhum orçamento é aprovado por aqui.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Modal: Services Dialog */}
      {isServicesOpen && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeServicesModal();
          }}
        >
          <div 
            id="services-dialog" 
            role="dialog"
            aria-modal="true"
            aria-labelledby="services-title"
          >
          <div className="dialog-top">
            <span className="eyebrow">RESOLVE Notebook / Banco Técnico de Serviços</span>
            <button className="dialog-close" onClick={closeServicesModal} aria-label="Fechar serviços">×</button>
          </div>

          <div className="dialog-body">
            <p className="eyebrow">Laboratório de Bancada na Santa Ifigênia</p>
            <h2 id="services-title">Catálogo Completo de Serviços.</h2>
            <p className="dialog-intro-text">
              Consulte nossa relação completa com os 20 procedimentos e especialidades de bancada executados em nosso laboratório próprio.
            </p>

            <div className="service-search-wrap">
              <label className="service-search">
                <span className="service-search-label">Buscar procedimento ou sintoma:</span>
                <input 
                  type="search" 
                  placeholder="Ex.: não liga, tela quebrada, curto, dobradiça, pasta térmica, BIOS, líquido, SSD..." 
                  id="service-search" 
                  value={serviceSearch} 
                  onChange={(e) => setServiceSearch(e.target.value)}
                  autoComplete="off" 
                />
              </label>
              <div className="catalog-meta-bar">
                <span>
                  {serviceSearch.trim() ? (
                    <>Resultados para "<strong>{serviceSearch.trim()}</strong>" ({matchingServicesCount} procedimentos encontrados em {filteredCategories.length} categorias)</>
                  ) : (
                    <><strong>20 Especialidades de Bancada</strong> • 140 procedimentos técnicos catalogados</>
                  )}
                </span>
                {!serviceSearch.trim() && (
                  <button 
                    type="button" 
                    className="catalog-toggle-all"
                    onClick={toggleAllCategories}
                  >
                    {expandedCats.length === FULL_SERVICES_CATALOG.length ? 'Recolher todas' : 'Expandir todas'}
                  </button>
                )}
              </div>
            </div>

            <div id="full-services-accordion" className="services-accordion" aria-live="polite">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const isExpanded = serviceSearch.trim() ? true : expandedCats.includes(cat.number);
                  return (
                    <div key={cat.number} className={`service-cat-card ${isExpanded ? 'is-open' : ''}`}>
                      <button 
                        type="button" 
                        className="service-cat-header"
                        onClick={() => toggleCategory(cat.number)}
                        aria-expanded={isExpanded}
                      >
                        <div className="service-cat-title-group">
                          <span className="service-cat-badge">{cat.number}</span>
                          <span className="service-cat-name">{cat.title}</span>
                        </div>
                        <div className="service-cat-action">
                          <span className="service-cat-count">{cat.displayItems.length} procedimentos</span>
                          <svg className={`service-cat-arrow ${isExpanded ? 'rotated' : ''}`} aria-hidden="true">
                            <use href="#arrow"/>
                          </svg>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="service-cat-content">
                          <ul className="service-subitems-list">
                            {cat.displayItems.map((item, idx) => (
                              <li key={idx} className="service-subitem-row">
                                <div className="service-subitem-text">
                                  <svg className="service-check-icon" aria-hidden="true"><use href="#check"/></svg>
                                  <span>{item}</span>
                                </div>
                                <button 
                                  type="button"
                                  className="service-subitem-cta"
                                  title="Solicitar avaliação para este procedimento"
                                  onClick={() => {
                                    closeServicesModal();
                                    openRepairModal(item);
                                  }}
                                >
                                  Solicitar avaliação <svg aria-hidden="true"><use href="#arrow"/></svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="service-cat-footer">
                            <button 
                              type="button" 
                              className="service-cat-direct-btn"
                              onClick={() => {
                                closeServicesModal();
                                openRepairModal(cat.title);
                              }}
                            >
                              Avaliar defeito em {cat.title} <svg aria-hidden="true"><use href="#right"/></svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="no-result" style={{ padding: '36px 20px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>Nenhum procedimento encontrado para "{serviceSearch}".</p>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
                    Não encontrou exatamente o seu termo? Converse direto com nossos técnicos pelo WhatsApp para tirar dúvidas sobre o seu equipamento.
                  </p>
                  <button 
                    type="button" 
                    className="button button-yellow" 
                    style={{ margin: '0 auto', display: 'inline-flex', padding: '12px 24px' }}
                    onClick={() => {
                      window.open(`https://wa.me/5511988095982?text=${encodeURIComponent(`Olá! Vim pelo site da RESOLVE Notebook e gostaria de consultar sobre o seguinte serviço: ${serviceSearch}`)}`, '_blank');
                    }}
                  >
                    Falar com um técnico no WhatsApp <svg aria-hidden="true"><use href="#arrow"/></svg>
                  </button>
                </div>
              )}
            </div>

            <p className="dialog-footnote">
              A indicação do procedimento exato e o orçamento dependem sempre da avaliação física em laboratório.
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

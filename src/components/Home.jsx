import React, { useState, useEffect, useRef } from 'react';

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

const serviceData = [
  ['Placa-mãe e eletrônica', 'Diagnóstico e reparo de falhas que impedem o funcionamento.', 'Não liga ou não carrega'],
  ['Tela e cabo flat', 'Troca de tela e correção de falhas de imagem.', 'Tela quebrada ou sem imagem'],
  ['Carcaça e dobradiças', 'Recuperação de fixações, bases e estrutura.', 'Carcaça ou dobradiça quebrada'],
  ['Limpeza e pasta térmica', 'Manutenção preventiva e cuidado com o superaquecimento.', 'Lento, travando ou esquentando'],
  ['Cooler e refrigeração', 'Ventilação, ruídos e controle de temperatura.', 'Lento, travando ou esquentando'],
  ['SSD e memória RAM', 'Mais capacidade e agilidade para a sua rotina.', 'Upgrade de SSD e memória'],
  ['Bateria e conector de carga', 'Autonomia, carregamento e conectores.', 'Bateria dura pouco'],
  ['Teclado e touchpad', 'Teclas com falhas, teclado e navegação.', 'Teclado ou sistema com falhas'],
  ['Windows e macOS', 'Reinstalação e configuração do sistema.', 'Teclado ou sistema com falhas'],
  ['Desoxidação por líquidos', 'Avaliação de equipamentos que tiveram contato com líquidos.', 'Contato com líquido'],
  ['Backup e recuperação de dados', 'Avaliação e orientação para acesso aos seus arquivos.', 'Backup e recuperação de dados']
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
  const [activeUsage, setActiveUsage] = useState('Trabalho');

  // Repair Dialog State
  const [isRepairOpen, setIsRepairOpen] = useState(false);
  const [repairStep, setRepairStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [notes, setNotes] = useState('');

  // Services Dialog State
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');

  // FAQ open states
  const [openFaq, setOpenFaq] = useState(null);

  // Read initial profile from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('perfil');
    if (p) {
      const match = Object.keys(useContent).find(k => k.toLowerCase() === p.toLowerCase());
      if (match) setActiveUsage(match);
    }
  }, []);

  const handleSelectUsage = (usage) => {
    setActiveUsage(usage);
    const p = usage.toLowerCase();
    const url = new URL(window.location.href);
    url.searchParams.set('perfil', p);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  };

  const openRepairModal = (issue = '') => {
    setMenuOpen(false);
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

  const generateWhatsAppLink = () => {
    let msg = `Olá! Vim pelo site da RESOLVE Notebook.\n\nProblema: ${selectedIssue || 'Avaliação geral'}.`;
    if (brand) msg += `\nMarca: ${brand}.`;
    if (model.trim()) msg += `\nModelo: ${model.trim()}.`;
    if (notes.trim()) msg += `\nDetalhes: ${notes.trim()}`;
    msg += '\n\nGostaria de conversar com um técnico sobre a avaliação do equipamento.';
    return `https://wa.me/5511988095982?text=${encodeURIComponent(msg)}`;
  };

  const filteredServices = serviceData.filter(row => 
    normalize(row.join(' ')).includes(normalize(serviceSearch))
  );

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
          <symbol id="chat" viewBox="0 0 24 24"><path d="M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L2 22l1.9-6a9 9 0 1 1 17.1-4.5Z"/><path d="M8 8c.5 4 2 5.5 6 7l2-2-3-1-1 1c-1.5-.8-2.5-1.8-3-3l1-1-1-3-1 2Z"/></symbol>
          <symbol id="case" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M8 7V3h8v4M2 12h20m-12-1v3h4v-3"/></symbol>
        </defs>
      </svg>

      <a className="skip" href="#conteudo">Pular para o conteúdo</a>

      {/* Utility Top Bar */}
      <div className="utility">
        <div className="wrap utility-inner">
          <span>Santa Ifigênia, São Paulo <span className="utility-dot">•</span> Loja física</span>
          <a href="https://share.google/LUfygV4B9Dst4atvz" target="_blank" rel="noopener noreferrer">
            Rua Santa Ifigênia, 361 — Loja 14 <svg aria-hidden="true"><use href="#arrow"/></svg>
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="wrap header-inner">
          <a className="brand" href="#inicio" aria-label="RESOLVE Notebook, início">
            <img 
              src="/assets/logo-original.png" 
              alt="Logo RESOLVE" 
              width="44" 
              height="44" 
              style={{ cursor: 'pointer' }}
              title="RESOLVE Notebook"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNavigate('/admin');
              }}
            />
            <span>RESOLVE<span className="brand-sub">NOTEBOOK</span></span>
          </a>

          <nav id="main-nav" className={menuOpen ? 'is-open' : ''} aria-label="Navegação principal">
            <a href="#assistencia" onClick={() => setMenuOpen(false)}>Assistência</a>
            <a href="/produtos" onClick={(e) => { e.preventDefault(); onNavigate('/produtos'); setMenuOpen(false); }}>Produtos</a>
            <a href="#empresas" onClick={() => setMenuOpen(false)}>Para empresas</a>
            <a href="#loja" onClick={() => setMenuOpen(false)}>A loja</a>
          </nav>

          <a 
            className="button button-dark header-cta" 
            href="https://wa.me/5511988095982?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20RESOLVE%20Notebook%20e%20gostaria%20de%20falar%20com%20um%20t%C3%A9cnico."
            target="_blank" 
            rel="noopener noreferrer"
          >
            Falar com um técnico <svg aria-hidden="true"><use href="#arrow"/></svg>
          </a>

          <button 
            className="menu-toggle" 
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

      <main id="conteudo">
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
            <div className="hero-note">
              <svg aria-hidden="true"><use href="#check"/></svg> O reparo começa com a sua aprovação.
            </div>
          </div>

          <figure className="hero-visual">
            <img 
              className="hero-photo" 
              src="/assets/repair.jpg" 
              alt="Mãos trabalhando nos componentes internos de um notebook, imagem ilustrativa" 
              width="1400" 
              height="2100" 
            />
            <figcaption>
              <span>Reparo, cuidado e precisão.</span>
              <span>RESOLVE Notebook</span>
            </figcaption>
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
              <p>Escolha o sintoma para<br/>iniciar o atendimento.</p>
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

          <div className="brand-strip">
            <span>Cuidado com as marcas que você usa.</span>
            <div>
              <b>DELL</b>
              <b>Lenovo</b>
              <b>ASUS</b>
              <b>acer</b>
              <b>HP</b>
              <b>SAMSUNG</b>
              <b>Apple</b>
            </div>
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
                  height="800" 
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
            <p className="section-description">
              Equipamentos revisados e testados na loja física. Conte para a gente o que você precisa fazer.
            </p>
          </div>

          <div className="notebook-grid">
            <figure>
              <img 
                src="/assets/laptop-workspace.jpg" 
                alt="Notebook Dell sobre uma superfície clara, imagem ilustrativa" 
                width="1400" 
                height="933" 
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
                onClick={(e) => {
                  e.preventDefault();
                  setOpenFaq(openFaq === idx ? null : idx);
                }}
              >
                <summary>
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
                href="https://share.google/LUfygV4B9Dst4atvz" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Traçar rota até a loja <svg aria-hidden="true"><use href="#arrow"/></svg>
              </a>
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNavigate('/admin');
              }}
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
          <a href="/admin" onClick={(e) => { e.preventDefault(); onNavigate('/admin'); }}>
            Acesso administrativo
          </a>
          <a href="#inicio">Voltar ao topo ↑</a>
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
        <svg aria-hidden="true"><use href="#chat"/></svg>
      </a>

      {/* Modal: Repair Dialog (2 Etapas) */}
      {isRepairOpen && (
        <dialog 
          id="repair-dialog" 
          open 
          aria-labelledby="repair-title" 
          aria-describedby="repair-description"
          onClick={(e) => {
            if (e.target.id === 'repair-dialog') closeRepairModal();
          }}
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
              <form id="repair-step-two" onSubmit={(e) => e.preventDefault()}>
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

                <a 
                  id="repair-whatsapp" 
                  className="button button-yellow" 
                  href={generateWhatsAppLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => closeRepairModal()}
                >
                  Continuar no WhatsApp <svg aria-hidden="true"><use href="#arrow"/></svg>
                </a>
                <p className="dialog-footnote">
                  Você confere e envia a mensagem no WhatsApp. Nenhum orçamento é aprovado por aqui.
                </p>
              </form>
            )}
          </div>
        </dialog>
      )}

      {/* Modal: Services Dialog */}
      {isServicesOpen && (
        <dialog 
          id="services-dialog" 
          open 
          aria-labelledby="services-title"
          onClick={(e) => {
            if (e.target.id === 'services-dialog') closeServicesModal();
          }}
        >
          <div className="dialog-top">
            <span className="eyebrow">RESOLVE Notebook / Assistência</span>
            <button className="dialog-close" onClick={closeServicesModal} aria-label="Fechar serviços">×</button>
          </div>

          <div className="dialog-body">
            <p className="eyebrow">Reparos e manutenção</p>
            <h2 id="services-title">Nossos serviços.</h2>

            <label className="service-search">
              Encontrar um serviço
              <input 
                type="search" 
                placeholder="Busque por tela, SSD, bateria…" 
                id="service-search" 
                value={serviceSearch} 
                onChange={(e) => setServiceSearch(e.target.value)}
                autoComplete="off" 
              />
            </label>

            <div id="all-services-list" aria-live="polite">
              {filteredServices.length > 0 ? (
                filteredServices.map(([name, desc, issue], idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    onClick={() => {
                      closeServicesModal();
                      openRepairModal(issue);
                    }}
                  >
                    <span>
                      <strong>{name}</strong>
                      <small>{desc}</small>
                    </span>
                    <svg aria-hidden="true"><use href="#arrow"/></svg>
                  </button>
                ))
              ) : (
                <p className="no-result">
                  Não encontrou? Tente outro termo ou fale com a nossa equipe pelo WhatsApp.
                </p>
              )}
            </div>

            <p className="dialog-footnote">
              A indicação do procedimento e o orçamento dependem da avaliação do equipamento.
            </p>
          </div>
        </dialog>
      )}
    </div>
  );
}

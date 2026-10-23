import React, { useState, useMemo } from 'react';
import { SERVICES, FULL_SERVICES_CATALOG, SITE_CONFIG } from '../data/siteConfig';
import { 
  Sparkles, 
  AppWindow, 
  HardDrive, 
  Monitor, 
  Keyboard, 
  BatteryCharging, 
  Cpu, 
  Gauge, 
  Database,
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle2,
  Wrench,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';

const iconMap = {
  Sparkles,
  AppWindow,
  HardDrive,
  Monitor,
  Keyboard,
  BatteryCharging,
  Cpu,
  Gauge,
  Database,
  ShieldAlert,
};

const CATEGORIES = [
  { id: 'all', label: 'Todos os Serviços', icon: SlidersHorizontal },
  { id: 'placa', label: 'Placa & Não Liga', icon: Cpu },
  { id: 'tela', label: 'Tela & Dobradiças', icon: Monitor },
  { id: 'upgrade', label: 'Upgrades & SSD', icon: HardDrive },
  { id: 'termica', label: 'Limpeza & Térmica', icon: Flame },
  { id: 'perifericos', label: 'Teclado & Bateria', icon: BatteryCharging },
  { id: 'software', label: 'Sistema & Dados', icon: AppWindow },
];

export default function Services({ onSelectService }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTechnicalCatalog, setShowTechnicalCatalog] = useState(false);
  const [expandedCatalogItem, setExpandedCatalogItem] = useState(null);

  // Filtered featured services
  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.badge?.toLowerCase().includes(q) ||
        (service.items && service.items.some(item => item.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Grouped technical catalog for clean presentation (4 thematic pillars)
  const technicalPillars = useMemo(() => [
    {
      title: 'Microeletrônica & Reparo de Placa',
      categories: FULL_SERVICES_CATALOG.filter(c => ['01', '14', '15', '16', '17'].includes(c.number))
    },
    {
      title: 'Estrutura, Tela & Carcaça',
      categories: FULL_SERVICES_CATALOG.filter(c => ['04', '06', '09'].includes(c.number))
    },
    {
      title: 'Desempenho, Upgrades & Software',
      categories: FULL_SERVICES_CATALOG.filter(c => ['08', '12', '13', '18'].includes(c.number))
    },
    {
      title: 'Refrigeração, Bateria & Periféricos',
      categories: FULL_SERVICES_CATALOG.filter(c => ['02', '03', '05', '07', '10', '11', '19', '20'].includes(c.number))
    }
  ], []);

  const handleWhatsApp = (serviceTitle) => {
    const text = `Olá! Gostaria de um orçamento para o serviço: *${serviceTitle}*. Meu notebook está com defeito e preciso de atendimento.`;
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="servicos" className="py-20 bg-[#090a0d] border-t border-zinc-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" /> Laboratório Especializado em Notebooks
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Nossos <span className="text-amber-400">Serviços</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
            Consertos rápidos, precisos e com garantia formal. De reparos estruturais em dobradiças ao diagnóstico avançado em microeletrônica de placas.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4 mb-10">
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-amber-400/80 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="O que está acontecendo com seu notebook? (ex: tela trincada, não liga, esquentando, dobradiça...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12141d] border border-zinc-700/80 hover:border-zinc-600 focus:border-amber-400 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition shadow-lg shadow-black/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded-md"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-none px-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-105'
                      : 'bg-[#12141c] text-gray-300 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1 mb-6 border-b border-zinc-800/60 pb-3">
          <span>
            Exibindo <strong className="text-amber-400">{filteredServices.length}</strong> {filteredServices.length === 1 ? 'serviço encontrado' : 'serviços especializados'}
          </span>
          <span className="text-zinc-500 hidden sm:inline">
            📍 Laboratório próprio no Shopping 355 • Santa Ifigênia
          </span>
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const Icon = iconMap[service.icon] || Sparkles;

              return (
                <div
                  key={service.id}
                  className="group relative bg-[#11131a] hover:bg-[#141722] border border-zinc-800/90 hover:border-amber-400/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] hover:-translate-y-1"
                >
                  <div>
                    {/* Top Pill / Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-400/10 border border-amber-400/20 text-amber-400">
                        {service.badge || 'Laboratório'}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/40 text-amber-400 flex items-center justify-center transition-all">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2.5">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Checkmarks / Included procedures */}
                    {service.items && (
                      <div className="space-y-2 pt-3 border-t border-zinc-800/60 mb-5">
                        {service.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      onClick={() => onSelectService(service)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wide transition shadow cursor-pointer"
                    >
                      <span>Simular Orçamento</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleWhatsApp(service.title)}
                      className="inline-flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                      title="Falar no WhatsApp sobre este serviço"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#11131a] rounded-2xl border border-zinc-800">
            <p className="text-gray-300 text-base font-semibold">Nenhum serviço encontrado para "{searchQuery}".</p>
            <p className="text-xs text-zinc-500 mt-1">Tente pesquisar por outros termos como "tela", "cooler", "bateria" ou "placa".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 bg-amber-400 text-black text-xs font-bold rounded-lg cursor-pointer"
            >
              Ver Todos os Serviços
            </button>
          </div>
        )}

        {/* Bottom Callout / Full Technical Catalog Drawer */}
        <div className="mt-14 pt-8 border-t border-zinc-800/80">
          <div className="bg-gradient-to-r from-[#12141f] via-[#10121a] to-[#12141f] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Diretório Técnico Completo
              </div>
              <h4 className="text-xl font-bold text-white">
                Procurando um procedimento específico da bancada?
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                Consulte nossa relação completa com os 20 procedimentos técnicos executados em laboratório na Santa Ifigênia.
              </p>
            </div>

            <button
              onClick={() => setShowTechnicalCatalog(!showTechnicalCatalog)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-400/40 text-amber-400 hover:text-amber-300 text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer shadow"
            >
              <span>{showTechnicalCatalog ? 'Ocultar Especialidades' : 'Ver as 20 Especialidades de Bancada'}</span>
              {showTechnicalCatalog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsible 20 Technical Categories View (Organized by Pillars) */}
          {showTechnicalCatalog && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
              {technicalPillars.map((pillar, pillarIdx) => (
                <div key={pillarIdx} className="bg-[#11131a] border border-zinc-800/90 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-amber-400 pb-3 mb-3 border-b border-zinc-800/80">
                      {pillar.title}
                    </h5>
                    <div className="space-y-2">
                      {pillar.categories.map((cat) => {
                        const isExpanded = expandedCatalogItem === cat.number;

                        return (
                          <div 
                            key={cat.number} 
                            className="bg-[#161924] border border-zinc-800/70 rounded-xl p-3 cursor-pointer hover:border-amber-400/40 transition"
                            onClick={() => setExpandedCatalogItem(isExpanded ? null : cat.number)}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-white">
                                {cat.title}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              )}
                            </div>

                            {isExpanded && (
                              <ul className="mt-2.5 pt-2 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-gray-300">
                                {cat.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-start gap-1.5 leading-tight">
                                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                                <div className="pt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectService({ title: cat.title });
                                    }}
                                    className="w-full text-center py-1.5 bg-amber-400/15 hover:bg-amber-400 text-amber-400 hover:text-black font-bold rounded-lg text-[10px] uppercase transition cursor-pointer"
                                  >
                                    Solicitar Esta Especialidade
                                  </button>
                                </div>
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trust Guarantees Bar */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#11131a] border border-zinc-800/60">
              <span className="text-amber-400 font-bold text-sm block">🛡️ Garantia Formal de 90 Dias</span>
              <span className="text-xs text-gray-400">Em todos os reparos com nota e laudo técnico</span>
            </div>
            <div className="p-4 rounded-xl bg-[#11131a] border border-zinc-800/60">
              <span className="text-amber-400 font-bold text-sm block">⚡ Diagnóstico Transparente</span>
              <span className="text-xs text-gray-400">Sem surpresas: orçamento informado antes da execução</span>
            </div>
            <div className="p-4 rounded-xl bg-[#11131a] border border-zinc-800/60">
              <span className="text-amber-400 font-bold text-sm block">📍 Santa Ifigênia, 361 • Loja 14</span>
              <span className="text-xs text-gray-400">Shopping 355 com fácil acesso para atendimento presencial</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
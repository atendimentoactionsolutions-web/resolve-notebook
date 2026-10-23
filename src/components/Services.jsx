import React, { useState } from 'react';
import { FEATURED_SERVICES, FULL_SERVICES_CATALOG, SITE_CONFIG } from '../data/siteConfig';
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
  BookOpen,
  ChevronRight,
  MessageSquare,
  ShieldCheck
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

export default function Services({ onSelectService }) {
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalog = FULL_SERVICES_CATALOG.filter(cat => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.items.some(item => item.toLowerCase().includes(q))
    );
  });

  const activeCategory = filteredCatalog[selectedCategoryIdx] || filteredCatalog[0] || FULL_SERVICES_CATALOG[0];

  return (
    <section id="servicos" className="py-20 bg-[#090a0d] border-t border-zinc-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Wrench className="w-3.5 h-3.5" /> Laboratório Especializado
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Nossos <span className="text-amber-400">Serviços</span>
            </h2>
            <p className="mt-2 text-base text-gray-400 max-w-2xl">
              Manutenção completa, preventiva e reparo de microeletrônica para notebooks de todas as marcas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFullCatalog(!showFullCatalog)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer"
            >
              <BookOpen className="w-4 h-4 stroke-[2.4]" />
              <span>{showFullCatalog ? 'Ver Menos Especialidades' : 'Ver Todas as 20 Especialidades'}</span>
            </button>
          </div>
        </div>

        {/* 9 Featured Services Grid (Visual padrão de alta conversão) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Sparkles;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="group relative bg-[#12141c] hover:bg-[#161924] border border-zinc-800/80 hover:border-amber-400/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/60 text-amber-400 group-hover:bg-amber-400/10 group-hover:border-amber-400/40 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-500 font-mono">
                      #{String(service.categoryNumber).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors duration-200 mb-2 leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-amber-400 transition-colors">
                  <span>Solicitar este serviço</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* MASTER-DETAIL CATALOG (Layout Profissional sem Quebras nem Espaços Vazios) */}
        {showFullCatalog && (
          <div className="mt-16 pt-12 border-t border-zinc-800/80 animate-fadeIn">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Diretório Técnico Oficial
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                Catálogo de Especialidades da Bancada
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                Selecione uma especialidade à esquerda para ver os procedimentos técnicos executados na Santa Ifigênia.
              </p>

              {/* Search bar */}
              <div className="mt-6 relative max-w-md mx-auto">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por placa, tela, dobradiça, bga, bios..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedCategoryIdx(0);
                  }}
                  className="w-full bg-[#141622] border border-zinc-700 focus:border-amber-400 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition shadow"
                />
              </div>
            </div>

            {/* Master-Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Categories List (Sempre simétrico e alinhado) */}
              <div className="lg:col-span-5 bg-[#12141c] border border-zinc-800 rounded-2xl p-2 max-h-[520px] overflow-y-auto space-y-1 shadow-lg">
                {filteredCatalog.map((cat, idx) => {
                  const isSelected = activeCategory?.number === cat.number;

                  return (
                    <button
                      key={cat.number}
                      onClick={() => setSelectedCategoryIdx(idx)}
                      className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-black font-extrabold shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-zinc-800/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 ${
                          isSelected ? 'bg-black text-amber-400 font-bold' : 'bg-zinc-900 border border-zinc-700 text-amber-400'
                        }`}>
                          {cat.number}
                        </span>
                        <span className="text-xs sm:text-sm truncate">
                          {cat.title}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-black' : 'text-zinc-500'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Detailed Card with Procedures */}
              <div className="lg:col-span-7 bg-[#12141c] border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(245,158,11,0.1)] flex flex-col justify-between min-h-[520px]">
                {activeCategory ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between pb-5 border-b border-zinc-800 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                            Especialidade #{activeCategory.number}
                          </span>
                          <span className="text-xs text-zinc-500 font-medium">Laboratório de Bancada</span>
                        </div>
                        <h4 className="text-2xl font-black text-white">
                          {activeCategory.title}
                        </h4>
                      </div>
                    </div>

                    {/* Procedures List */}
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Procedimentos Realizados Nesta Área:
                      </h5>
                      <ul className="grid grid-cols-1 gap-2.5">
                        {activeCategory.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#171a26] border border-zinc-800/80 text-xs sm:text-sm text-gray-200">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Guarantees Box */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                      <span>🛡️ Peças originais e garantia formalizada</span>
                      <span className="text-amber-400 font-semibold">Shopping 355 • Lj 14</span>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectService({ title: `${activeCategory.number}. ${activeCategory.title}` })}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_25px_rgba(245,158,11,0.55)] cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 stroke-[2.4]" />
                        <span>Solicitar Orçamento para {activeCategory.title}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 text-sm">
                    Nenhuma especialidade encontrada na busca.
                  </div>
                )}
              </div>

            </div>

            {/* Observações Técnicas */}
            <div className="mt-8 p-5 rounded-2xl bg-[#141620] border border-zinc-800 text-xs text-gray-400 leading-relaxed">
              <h5 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-4 h-4" /> Observações Técnicas Importantes
              </h5>
              <p>
                A execução de cada serviço depende do modelo, da disponibilidade de componentes e da estrutura da assistência. Upgrades de memória e armazenamento dependem da compatibilidade do equipamento (componentes soldados podem impedir expansão convencional). Reparos eletrônicos, reballing BGA e programação de BIOS exigem bancada e profissionais especializados. Recuperação física de dados depende das condições da unidade magnética ou controladora.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

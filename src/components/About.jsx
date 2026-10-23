import React from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { Award, CheckCircle, MapPin, ExternalLink, Navigation } from 'lucide-react';

export default function About() {
  return (
    <section id="sobre" className="py-20 bg-[#0c0e14] border-t border-zinc-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Tradição e Excelência
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Especialistas em notebooks no coração da{' '}
              <span className="text-amber-400">Santa Ifigênia</span>
            </h2>

            <p className="text-gray-300 text-base leading-relaxed">
              A <strong>Resolve Notebook</strong> nasceu para oferecer um atendimento transparente, técnico e definitivo para o seu equipamento. Localizados no polo tecnológico mais famoso do Brasil, contamos com bancada de testes de última geração, componentes originais e técnicos capacitados para resolver desde falhas simples até reparos complexos em placas-mãe.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#141620] border border-zinc-800">
                <div className="text-amber-400 font-extrabold text-2xl mb-1">5.0 ★★★★★</div>
                <div className="text-xs text-gray-400">Mais de 685 avaliações no Google Meu Negócio</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#141620] border border-zinc-800">
                <div className="text-amber-400 font-extrabold text-2xl mb-1">Garantia</div>
                <div className="text-xs text-gray-400">Em todos os serviços e peças instaladas</div>
              </div>
            </div>

            {/* Direct Google Maps Location Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#141724] to-[#12141c] border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Venha nos visitar na loja física</h4>
                  <p className="text-xs text-amber-300 font-medium">{SITE_CONFIG.address}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Próximo às estações São Bento e Luz do Metrô</p>
                </div>
              </div>

              <a
                href={SITE_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Como Chegar (Maps)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual badge / lab photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#13151e] p-6 space-y-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800&auto=format&fit=crop"
                  alt="Laboratório técnico Resolve Notebook"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-xs text-amber-300 font-semibold">
                  Laboratório de Microeletrônica
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Diagnóstico sem compromisso</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Peças novas com procedência comprovada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Atendimento rápido para quem não pode parar de trabalhar</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

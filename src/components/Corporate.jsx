import React from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { Check, Briefcase, Users, Shield, Clock } from 'lucide-react';

export default function Corporate() {
  const corporateWaUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Represento uma empresa e gostaria de conversar com um consultor sobre soluções de TI e manutenção corporativa na Resolve Notebook.'
  )}`;

  const benefits = [
    'Atendimento personalizado',
    'Planos para empresas',
    'Suporte técnico especializado',
    'Agilidade no atendimento',
  ];

  return (
    <section id="empresas" className="py-20 bg-[#0b0c10] border-t border-zinc-800/60 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#12141c] border border-zinc-800 rounded-3xl overflow-hidden p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Office Laptops Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                  alt="Soluções de TI corporativa"
                  className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-amber-300 font-semibold bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-amber-400/20">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Contratos de Manutenção Corporativa
                  </span>
                  <span className="text-gray-300">SLA Prioritário</span>
                </div>
              </div>
            </div>

            {/* Right: Text & Bullet Points */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
                  <Briefcase className="w-3.5 h-3.5" /> B2B & Corporativo
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Soluções de TI <span className="text-amber-400">para sua empresa</span>
                </h2>
                <p className="mt-3 text-base text-gray-300 leading-relaxed font-normal">
                  Manutenção preventiva e corretiva, upgrades em lote e suporte ágil para notebooks corporativos. Mais produtividade e zero paradas para o seu time.
                </p>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-2">
                {benefits.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={corporateWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#171923] hover:bg-[#1f2230] border border-amber-400/60 hover:border-amber-400 text-amber-300 hover:text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Falar com um consultor</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { SERVICES, SITE_CONFIG } from '../data/siteConfig';
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
  ArrowRight
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
};

export default function Services({ onSelectService }) {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Gostaria de consultar todos os serviços de manutenção para notebook.'
  )}`;

  return (
    <section id="servicos" className="py-20 bg-[#090a0d] border-t border-zinc-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Nossos <span className="text-amber-400">Serviços</span>
            </h2>
            <p className="mt-2 text-base text-gray-400">
              Manutenção completa para notebooks de todas as marcas.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>Ver todos os serviços</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 9 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Sparkles;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="group relative bg-[#12141c] hover:bg-[#161924] border border-zinc-800/80 hover:border-amber-400/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] hover:-translate-y-1"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/60 text-amber-400 group-hover:bg-amber-400/10 group-hover:border-amber-400/40 flex items-center justify-center mb-5 transition-all duration-300">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
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

      </div>
    </section>
  );
}

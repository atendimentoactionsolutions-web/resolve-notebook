import React from 'react';
import Logo from './Logo';
import { SITE_CONFIG } from '../data/siteConfig';
import { MapPin, Clock, MessageCircle } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Estava navegando no site da Resolve Notebook e gostaria de tirar uma dúvida.'
  )}`;

  return (
    <footer id="contato" className="bg-[#07080b] border-t border-zinc-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-zinc-800/80">
          
          {/* Logo & Slogan */}
          <div className="lg:col-span-4 space-y-3">
            <Logo size="lg" />
            <div className="pt-1">
              <span className="font-script text-2xl text-amber-300/80 drop-shadow">
                Tecnologia que te move
              </span>
            </div>
          </div>

          {/* Location with Google Maps link */}
          <a
            href={SITE_CONFIG.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-3 flex items-start gap-3 group text-left hover:opacity-95 transition"
          >
            <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover:border-amber-400/60 group-hover:bg-amber-400/20 transition shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                  {SITE_CONFIG.addressShort}
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30 font-semibold">
                  Google Maps
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {SITE_CONFIG.addressReference}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {SITE_CONFIG.address}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 mt-1.5 group-hover:underline">
                Como chegar no Maps →
              </span>
            </div>
          </a>

          {/* Social & Hours */}
          <div className="lg:col-span-3 space-y-4">
            {/* Instagram */}
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition group"
            >
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover:border-amber-400/50 transition shrink-0">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                  {SITE_CONFIG.instagramHandle}
                </span>
                <p className="text-xs text-gray-400">Siga no Instagram</p>
              </div>
            </a>

            {/* Hours */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-gray-400">Horário de atendimento</span>
                <p className="text-xs font-semibold text-white">
                  {SITE_CONFIG.openingHours}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Action Button */}
          <div className="lg:col-span-2 flex justify-start lg:justify-end">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm px-6 py-3.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-black/10 stroke-[2.2]" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>
            © {currentYear} Resolve Notebook. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-amber-400 transition">Política de Privacidade</a>
            <span>|</span>
            <a href="#" className="hover:text-amber-400 transition">Termos de Uso</a>
          </div>

          <p className="text-zinc-600">
            Desenvolvido para o seu melhor desempenho.
          </p>
        </div>

      </div>
    </footer>
  );
}

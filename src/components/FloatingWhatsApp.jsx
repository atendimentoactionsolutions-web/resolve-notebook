import React, { useState } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Gostaria de um atendimento rápido para o meu notebook.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#12141c] border border-amber-400/40 text-white text-xs px-3.5 py-2 rounded-2xl shadow-2xl animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Técnico online na Santa Ifigênia!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-zinc-500 hover:text-white ml-1"
            aria-label="Fechar dica"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all duration-300 transform hover:scale-110"
        aria-label="Falar pelo WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </a>
    </div>
  );
}

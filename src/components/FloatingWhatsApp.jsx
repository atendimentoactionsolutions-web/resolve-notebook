import React, { useState } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false); // keep closed by default so it never covers content!

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Gostaria de um orçamento para o meu notebook na Resolve Notebook.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#12141c] border border-amber-400/40 text-white text-xs px-3 py-1.5 rounded-xl shadow-2xl animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Falar com o Técnico</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-zinc-500 hover:text-white ml-1 cursor-pointer"
            aria-label="Fechar"
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
        onMouseEnter={() => setShowTooltip(true)}
        className="relative group flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all duration-300 transform hover:scale-105"
        aria-label="Falar pelo WhatsApp"
      >
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
        </span>
        <MessageCircle className="w-6 h-6 fill-white stroke-none" />
      </a>
    </div>
  );
}

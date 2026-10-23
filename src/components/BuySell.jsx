import React from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { Laptop, RefreshCw, ShoppingCart, ArrowRight } from 'lucide-react';

export default function BuySell({ onOpenQuote }) {
  const buyUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Tenho interesse em COMPRAR um notebook revisado na Resolve Notebook. Quais modelos estão disponíveis?'
  )}`;

  const sellUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Gostaria de VENDER meu notebook. Poderiam fazer uma avaliação do meu equipamento?'
  )}`;

  return (
    <section className="py-12 bg-[#090a0d] border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Comprar Notebook */}
          <div className="group bg-[#12141c] border border-zinc-800 hover:border-amber-400/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]">
            <div className="space-y-4 flex-1 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Quer <span className="text-amber-400">comprar um notebook</span>?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Equipamentos revisados e com garantia. Encontre o notebook ideal para estudo, trabalho ou games.
              </p>
              <div>
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ver notebooks</span>
                </a>
              </div>
            </div>

            {/* Laptop graphic */}
            <div className="w-full sm:w-48 aspect-[4/3] rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-3 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop"
                alt="Comprar notebook"
                className="w-full h-full object-cover rounded-lg opacity-85 group-hover:opacity-100 transition"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent" />
            </div>
          </div>

          {/* Card 2: Vender Notebook */}
          <div className="group bg-[#12141c] border border-zinc-800 hover:border-amber-400/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]">
            <div className="space-y-4 flex-1 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Quer <span className="text-amber-400">vender seu notebook</span>?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Faça uma avaliação com nossa equipe especializada e receba uma proposta justa e pagamento rápido.
              </p>
              <div>
                <a
                  href={sellUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Solicitar avaliação</span>
                </a>
              </div>
            </div>

            {/* Sell laptop graphic with recycling vibe */}
            <div className="w-full sm:w-48 aspect-[4/3] rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-3 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop"
                alt="Vender notebook"
                className="w-full h-full object-cover rounded-lg opacity-85 group-hover:opacity-100 transition"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

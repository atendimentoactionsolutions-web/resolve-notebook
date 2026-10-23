import React from 'react';
import { PRODUCTS, SITE_CONFIG } from '../data/siteConfig';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function Products() {
  const allProductsUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Gostaria de conferir a lista completa de produtos e notebooks disponíveis na Resolve Notebook.'
  )}`;

  return (
    <section id="produtos" className="py-20 bg-[#0b0c10] border-t border-zinc-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Produtos <span className="text-amber-400">em Destaque</span>
            </h2>
            <p className="mt-2 text-base text-gray-400">
              Notebooks, SSD, Memória RAM e muito mais.
            </p>
          </div>

          <a
            href={allProductsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>Ver todos os produtos</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => {
            const productWaUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
              product.whatsappMsg
            )}`;

            return (
              <div
                key={product.id}
                className="group bg-[#12141c] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:-translate-y-1"
              >
                {/* Image Container with Dark Vignette */}
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Gold Button */}
                  <a
                    href={productWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.45)]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{product.btnText}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

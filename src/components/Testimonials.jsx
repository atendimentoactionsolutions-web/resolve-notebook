import React from 'react';
import { TESTIMONIALS, SITE_CONFIG } from '../data/siteConfig';
import { Star, ArrowRight, Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#090a0d] border-t border-zinc-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400 font-extrabold text-lg">5,0</span>
              <div className="flex text-amber-400 text-sm">
                {'★'.repeat(5)}
              </div>
              <span className="text-xs font-bold text-gray-300 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700">
                {SITE_CONFIG.googleReviewCount} avaliações no Google
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              O que nossos clientes <span className="text-amber-400">dizem</span>
            </h2>
            <p className="mt-2 text-base text-gray-400">
              Confiança comprovada por quem consertou ou comprou na Santa Ifigênia.
            </p>
          </div>

          <a
            href={SITE_CONFIG.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>Ver todas as avaliações no Google</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 3 Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="bg-[#12141c] border border-zinc-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed italic">
                  “{item.text}”
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {item.name}
                  </h4>
                  <span className="text-xs text-amber-400/80 font-medium">
                    {item.role}
                  </span>
                </div>
                <Quote className="w-6 h-6 text-zinc-700/60" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

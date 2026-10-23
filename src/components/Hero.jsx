import React from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import logoImg from '../assets/logo.png';
import { 
  MessageSquare, 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  Gem, 
  Building2 
} from 'lucide-react';

export default function Hero({ onOpenQuote }) {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Gostaria de solicitar um orçamento para o meu notebook na Resolve Notebook.'
  )}`;

  return (
    <section id="inicio" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Google Rating Badge */}
            <a
              href={SITE_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161822] border border-amber-400/40 hover:border-amber-400 text-xs text-gray-200 shadow-md transition group"
            >
              <div className="flex items-center text-amber-400">
                <span className="font-extrabold mr-1 text-sm text-white">5,0</span>
                {'★'.repeat(5)}
              </div>
              <span className="text-zinc-500">•</span>
              <span className="text-gray-300 font-semibold group-hover:text-amber-400 transition">
                {SITE_CONFIG.googleReviewCount} avaliações no Google
              </span>
            </a>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Seu notebook com{' '}
              <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.35)]">
                desempenho de novo.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Assistência técnica especializada e venda de notebooks na Santa Ifigênia.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-base px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 fill-black/10 stroke-[2.2]" />
                <span>Solicitar orçamento</span>
              </button>

              <a
                href="#servicos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#14161d] hover:bg-[#1a1d27] border border-zinc-700/80 hover:border-amber-400/50 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-all duration-200"
              >
                <span>Ver nossos serviços</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
            </div>

            {/* 4 Trust Badges */}
            <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5 group">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover:border-amber-400/50 transition">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-300 leading-snug">
                  Atendimento especializado
                </span>
              </div>

              <div className="flex items-center gap-2.5 group">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover:border-amber-400/50 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-300 leading-snug">
                  Garantia nos serviços
                </span>
              </div>

              <div className="flex items-center gap-2.5 group">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover:border-amber-400/50 transition">
                  <Gem className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-300 leading-snug">
                  Peças de qualidade
                </span>
              </div>

              <div className="flex items-center gap-2.5 group">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover:border-amber-400/50 transition">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-300 leading-snug">
                  Atendimento para empresas
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Graphic with Laptops & Cursive Slogan */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Cursive slogan overlay */}
            <div className="absolute -top-6 right-2 sm:right-6 z-20 pointer-events-none transform -rotate-6 select-none">
              <span className="font-script text-3xl sm:text-4xl text-amber-300/90 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                Tecnologia que te move
              </span>
            </div>

            {/* Glowing laptop visual frame */}
            <div className="relative w-full max-w-lg">
              {/* Back ambient backlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-transparent blur-2xl rounded-3xl" />

              <div className="relative bg-[#11131a] border border-zinc-800 rounded-2xl p-3 shadow-2xl overflow-hidden group hover:border-amber-500/40 transition duration-500">
                {/* Modern Laptop Mockup */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-zinc-950 flex flex-col items-center justify-center p-6 border border-zinc-800/80">
                  {/* Cyber grid wallpaper background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* High tech neon visual inside screen with official logo */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                        <img
                          src={logoImg}
                          alt="Resolve Notebook Logo Oficial"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
                        resolve NOTEBOOK
                      </h3>
                      <div className="mt-1">
                        <span className="inline-block bg-amber-400 text-black font-extrabold text-[9px] px-2.5 py-0.5 rounded tracking-widest uppercase">
                          Assistência Técnica
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Laboratório Aberto • Santa Ifigênia</span>
                    </div>
                  </div>

                  {/* Laptop base keyboard hint */}
                  <div className="absolute -bottom-1 left-4 right-4 h-2 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 rounded-t-sm" />
                </div>

                {/* Secondary badge overlay */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400 px-2 py-1 bg-zinc-900/60 rounded-lg">
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Santa Ifigênia, SP
                  </span>
                  <span className="text-zinc-500">Diagnóstico Rápido & Preciso</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

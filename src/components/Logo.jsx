import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ size = 'default', showText = true, className = '' }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const imgSizeClass = isLarge ? 'w-14 h-14' : isSmall ? 'w-9 h-9' : 'w-11 h-11';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official circular logo with gradient ring */}
      <div className={`relative ${imgSizeClass} rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 shadow-[0_0_18px_rgba(245,158,11,0.35)] shrink-0 group-hover:shadow-[0_0_24px_rgba(236,72,153,0.5)] transition-all duration-300`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={logoImg}
            alt="Resolve Notebook"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Brand title lockup */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span className={`font-black tracking-tight text-white ${isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'}`}>
              resolve
            </span>
            <span className={`font-black tracking-tight text-amber-400 ${isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'}`}>
              NOTEBOOK
            </span>
          </div>
          <div className="mt-1 flex items-center">
            <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-[8px] sm:text-[9px] px-2 py-0.5 rounded tracking-widest uppercase shadow-sm">
              Assistência Técnica
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ size = 'default', showText = true, className = '' }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const avatarSize = isLarge ? 'w-12 h-12' : isSmall ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official circular logo badge with gradient ring */}
      <div className={`relative ${avatarSize} rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0 transition-transform group-hover:scale-105`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={logoImg}
            alt="Resolve Notebook"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Brand title lockup */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span className={`font-black tracking-tight text-white ${isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-lg sm:text-xl'}`}>
              resolve
            </span>
            <span className={`font-black tracking-tight text-amber-400 ${isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-lg sm:text-xl'}`}>
              NOTEBOOK
            </span>
          </div>
          <div className="mt-0.5">
            <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
              Assistência Técnica
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

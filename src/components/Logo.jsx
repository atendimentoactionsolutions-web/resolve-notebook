import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ size = 'default', showText = true, className = '', onClick }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  // Tamanhos grandes, imponentes e nítidos
  const avatarSize = isLarge ? 'w-16 h-16' : isSmall ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 h-14';
  const textSize = isLarge ? 'text-3xl sm:text-4xl' : isSmall ? 'text-lg' : 'text-2xl sm:text-3xl';
  const badgeSize = isLarge ? 'text-[10px] px-3 py-0.5' : isSmall ? 'text-[8px] px-2 py-0.5' : 'text-[9px] sm:text-[10px] px-2.5 py-0.5';

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }
  };

  return (
    <div 
      onClick={handleClick}
      onTouchEnd={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex items-center gap-3.5 select-none ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''} ${className}`}
    >
      {/* Selo circular oficial com anel dourado neon de alto impacto */}
      <div className={`relative ${avatarSize} rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_22px_rgba(245,158,11,0.5)] shrink-0 pointer-events-none`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={logoImg}
            alt="Resolve Notebook"
            className="w-full h-full object-cover pointer-events-none"
            draggable="false"
          />
        </div>
      </div>

      {/* Nome RESOLVE NOTEBOOK grande, em caixa alta e harmonizado */}
      {showText && (
        <div className="flex flex-col justify-center leading-none pointer-events-none">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight text-white uppercase ${textSize}`}>
              RESOLVE
            </span>
            <span className={`font-black tracking-tight text-amber-400 uppercase ${textSize}`}>
              NOTEBOOK
            </span>
          </div>
          <div className="mt-1 flex items-center">
            <span className={`inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black rounded tracking-widest uppercase shadow-sm ${badgeSize}`}>
              Assistência Técnica
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

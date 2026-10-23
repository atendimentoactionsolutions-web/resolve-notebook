import React from 'react';

export default function Logo({ size = 'default', showSubtext = true, className = '' }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`flex items-center gap-2.5 tracking-tight select-none ${className}`}>
      {/* Icon: Power inside gold square */}
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-transform group-hover:scale-105 ${
          isLarge ? 'w-11 h-11' : isSmall ? 'w-8 h-8 border-[1.5px]' : 'w-9 h-9'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isLarge ? 'w-6 h-6' : isSmall ? 'w-4 h-4' : 'w-5 h-5'}
        >
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      </div>

      {/* Brand text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`font-black tracking-wider text-white ${isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'}`}>
            resolve
          </span>
          <span className={`font-extrabold tracking-wider text-amber-400 ${isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'}`}>
            NOTEBOOK
          </span>
        </div>
        {showSubtext && (
          <span className="mt-0.5 text-[8.5px] font-bold tracking-[0.25em] text-amber-400/90 uppercase">
            Assistência Técnica
          </span>
        )}
      </div>
    </div>
  );
}

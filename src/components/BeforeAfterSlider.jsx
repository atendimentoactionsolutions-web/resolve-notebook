import React, { useState, useRef } from 'react';
import { Sparkles, ArrowLeftRight, Wrench, CheckCircle2 } from 'lucide-react';

const CASES = [
  {
    id: 'dobradica',
    title: 'Recuperação de Carcaça e Dobradiça Estourada',
    model: 'Dell G15 Gaming Series',
    problem: 'Carcaça superior quebrada ao meio, dobradiça travada e tampa sem fechar.',
    solution: 'Reconstrução com resina acrílica estrutural, alívio de torque na dobradiça e alinhamento de fábrica sem necessidade de trocar a carcaça inteira.',
    beforeImg: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800&auto=format&fit=crop', // Realistic hardware bench
    afterImg: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop', // Clean repaired laptop
  },
  {
    id: 'placa-oxigenada',
    title: 'Desoxidação e Reparo de Placa-Mãe que Caiu Líquido',
    model: 'Apple MacBook Air Retina',
    problem: 'Café derramado sobre o teclado. Notebook não ligava e apresentava curto na linha de 19V.',
    solution: 'Banho ultrassônico químico com álcool isopropílico, substituição de 3 mosfets em curto e recuperação de trilhas oxidadas.',
    beforeImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'termica',
    title: 'Superaquecimento Crítico e Manutenção Térmica',
    model: 'Acer Nitro 5 (Ryzen 7 + RTX)',
    problem: 'Atingindo 98°C e desligando em jogos. Cooler completamente obstruído por poeira e pasta térmica original ressecada como pedra.',
    solution: 'Desobstrução do sistema de cobre, substituição de thermal pads e aplicação de pasta térmica de prata de alta condutividade. Temperatura estabilizada em 72°C em carga máxima.',
    beforeImg: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop',
  }
];

export default function BeforeAfterSlider() {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const containerRef = useRef(null);

  const activeCase = CASES[activeCaseIdx];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPos(percentage);
  };

  const onMouseMove = (e) => {
    if (e.buttons === 1) { // dragging
      handleMove(e.clientX);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="py-20 bg-[#090a0f] border-t border-zinc-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Casos Reais de Bancada
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Antes & Depois do <span className="text-amber-400">Reparo Profissional</span>
          </h2>
          <p className="mt-3 text-base text-gray-400">
            Arraste o divisor central para conferir a transformação de notebooks que chegaram danificados na Santa Ifigênia.
          </p>

          {/* Case selector buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCaseIdx(idx);
                  setSliderPos(50);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCaseIdx === idx
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'bg-[#141622] text-gray-400 hover:text-white border border-zinc-800'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#11131c] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Left: Interactive Before & After Slider */}
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
              onClick={(e) => handleMove(e.clientX)}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-zinc-700/80 shadow-2xl group"
            >
              {/* After Image (Background) */}
              <img
                src={activeCase.afterImg}
                alt="Depois do reparo"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              <span className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow z-10">
                ✨ Após a Bancada
              </span>

              {/* Before Image (Clipped by sliderPos) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={activeCase.beforeImg}
                  alt="Antes do reparo"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
                  draggable={false}
                />
                <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-red-500/40 text-red-400 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow z-10">
                  ⚠️ Como Chegou
                </span>
              </div>

              {/* Slider Divider Bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)] cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-black border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-2xl transform active:scale-95 transition-transform">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] text-zinc-500 mt-3">
              ↔️ Arraste a linha central para a esquerda ou direita para comparar
            </p>
          </div>

          {/* Right: Technical Explanation */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30">
                {activeCase.model}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {activeCase.title}
              </h3>
            </div>

            {/* Problem Box */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Problema Relatado:
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeCase.problem}
              </p>
            </div>

            {/* Solution Box */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Solução Definitiva Executada:
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeCase.solution}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
              <span>🔧 Recuperação sem troca desnecessária</span>
              <span className="text-amber-400 font-bold">Garantia Formal</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

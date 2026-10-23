import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import logoImg from '../assets/logo.png';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Laptop, 
  ShieldCheck, 
  Star, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  Cpu,
  Monitor,
  Flame,
  Droplets,
  Battery,
  Keyboard,
  Wrench,
  HelpCircle,
  HardDrive
} from 'lucide-react';

const BRANDS = [
  { name: 'Dell', desc: 'Inspiron, Vostro, XPS, G15' },
  { name: 'Apple / Mac', desc: 'MacBook Air, Pro, M1/M2/M3' },
  { name: 'Lenovo', desc: 'IdeaPad, ThinkPad, Legion' },
  { name: 'Acer', desc: 'Aspire, Nitro 5, Predator' },
  { name: 'ASUS', desc: 'VivoBook, ZenBook, TUF, ROG' },
  { name: 'HP', desc: 'Pavilion, ProBook, Victus' },
  { name: 'Samsung', desc: 'Galaxy Book, Book2/3/4' },
  { name: 'Outra Marca', desc: 'Avell, Vaio, Positivo, etc.' },
];

const DEFECTS = [
  { id: 'nao-liga', title: 'Não liga / Sem sinal', desc: 'Não dá sinal de vida, nem luzes ou apaga sozinho', icon: Cpu },
  { id: 'tela', title: 'Tela Quebrada / Sem Imagem', desc: 'Display trincado, com listras, piscando ou tela preta', icon: Monitor },
  { id: 'upgrade', title: 'Upgrade de SSD & RAM', desc: 'Deixar notebook mais rápido ou aumentar armazenamento', icon: HardDrive },
  { id: 'dobradica', title: 'Dobradiça / Carcaça Quebrada', desc: 'Tampa solta, estourada ou plástico quebrando ao abrir', icon: ShieldCheck },
  { id: 'liquido', title: 'Caiu Água / Café / Molhou', desc: 'Derramamento de líquidos, desoxidação urgente da placa', icon: Droplets },
  { id: 'bateria', title: 'Bateria / Não Carrega', desc: 'Bateria viciada, estufada ou conector DC jack com folga', icon: Battery },
  { id: 'teclado', title: 'Teclado / Touchpad com Falha', desc: 'Teclas travadas, digitando sozinho ou sem resposta', icon: Keyboard },
  { id: 'lentidao', title: 'Aquecimento & Limpeza', desc: 'Cooler barulhento, notebook muito quente e travando', icon: Flame },
  { id: 'outro', title: 'Outro Defeito / Diagnóstico', desc: 'Avaliação completa da bancada técnica', icon: HelpCircle },
];

export default function QuoteModal({ isOpen, onClose, initialService }) {
  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedDefect, setSelectedDefect] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialService) {
      setSelectedDefect(initialService.title);
      setStep(1);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !selectedBrand) {
      alert('Por favor, selecione a marca do seu equipamento.');
      return;
    }
    if (step === 2 && !selectedDefect) {
      alert('Por favor, selecione o principal defeito ou serviço.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    const formattedMessage = `*SOLICITAÇÃO DE ORÇAMENTO FORMAL • RESOLVE NOTEBOOK*\n` +
      `--------------------------------------------------\n` +
      `👤 *Cliente:* ${customerName || 'Cliente'}\n` +
      `💻 *Marca:* ${selectedBrand || 'Não informada'}\n` +
      `⚙️ *Modelo:* ${modelInput || 'Não especificado'}\n` +
      `🔧 *Defeito / Serviço:* ${selectedDefect || 'Diagnóstico Geral'}\n` +
      (notes ? `📝 *Detalhes:* ${notes}\n` : '') +
      `--------------------------------------------------\n` +
      `📍 *Origem:* Site Oficial • Santa Ifigênia\n\n` +
      `Olá! Gostaria de uma estimativa de valor, prazo e disponibilidade de peças para o meu notebook.`;

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, '_blank');
    onClose();
    // Reset wizard
    setStep(1);
    setSelectedBrand('');
    setSelectedDefect('');
    setCustomerName('');
    setModelInput('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#11131c] border border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.25)] my-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800/80">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 shrink-0 shadow">
            <img src={logoImg} alt="Resolve Notebook" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                Orçamento Técnico Oficial
              </span>
              <span className="text-xs text-zinc-500">• Etapa {step} de 3</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Simulador de Orçamento em 3 Passos
            </h3>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-800 h-1.5 rounded-full my-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* STEP 1: Selecionar Marca */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h4 className="text-base font-bold text-white">
                1. Qual é a marca do seu notebook?
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Atendemos todas as marcas convencionais, gamers e linha corporativa na Santa Ifigênia.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BRANDS.map((b) => {
                const isSelected = selectedBrand === b.name;

                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setSelectedBrand(b.name)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] text-white'
                        : 'bg-[#151824] border-zinc-800 hover:border-zinc-700 text-gray-300 hover:bg-[#1a1e2d]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-sm ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                          {b.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                        {b.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedBrand}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                <span>Avançar para Defeito</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Selecionar Defeito / Serviço */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h4 className="text-base font-bold text-white">
                2. Qual o principal sintoma ou serviço desejado?
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Equipamento selecionado: <strong className="text-amber-400">{selectedBrand}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEFECTS.map((d) => {
                const Icon = d.icon;
                const isSelected = selectedDefect === d.title;

                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDefect(d.title)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] text-white'
                        : 'bg-[#151824] border-zinc-800 hover:border-zinc-700 text-gray-300 hover:bg-[#1a1e2d]'
                    }`}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-amber-400 mb-2">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h5 className={`font-bold text-xs sm:text-sm leading-snug ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                        {d.title}
                      </h5>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-snug">
                        {d.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedDefect}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                <span>Avançar para Detalhes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Dados & Envio WhatsApp */}
        {step === 3 && (
          <form onSubmit={handleSendWhatsApp} className="space-y-5 animate-fadeIn">
            <div>
              <h4 className="text-base font-bold text-white">
                3. Quase pronto! Para quem enviaremos a resposta?
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Gere o resumo formal para atendimento prioritário com os técnicos na Santa Ifigênia.
              </p>
            </div>

            {/* Resumo visual do que foi selecionado */}
            <div className="p-4 rounded-2xl bg-[#161925] border border-amber-400/30 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Marca Selecionada:</span>
                <strong className="text-white text-sm">{selectedBrand}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Problema / Serviço:</span>
                <strong className="text-amber-400 text-sm truncate block">{selectedDefect}</strong>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Seu Nome:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Modelo ou Ano (se souber):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Inspiron 15, Nitro 5, MacBook Air M1..."
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Observações ou Detalhes Adicionais (opcional):
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Aconteceu após uma queda / começou a esquentar muito / desliga sozinho em jogos..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
              />
            </div>

            {/* Selos de Confiança */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 border-t border-zinc-800 text-[11px] text-zinc-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Garantia de 90 Dias</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Nota 5.0 no Google</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Shopping 355 • Lj 14</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] cursor-pointer"
              >
                <Send className="w-4 h-4 fill-black/10 stroke-[2.4]" />
                <span>Enviar Orçamento Oficial no WhatsApp</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

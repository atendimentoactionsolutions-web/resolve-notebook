import React, { useState, useEffect } from 'react';
import { SITE_CONFIG, SERVICES } from '../data/siteConfig';
import logoImg from '../assets/logo.png';
import { X, Send, CheckCircle2, Laptop } from 'lucide-react';

export default function QuoteModal({ isOpen, onClose, initialService }) {
  const [selectedService, setSelectedService] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [defect, setDefect] = useState('');
  const [customerName, setCustomerName] = useState('');

  const brands = ['Dell', 'Acer', 'Lenovo', 'ASUS', 'HP', 'Apple / Mac', 'Samsung', 'Positivo / Vaio', 'Outra'];

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService.title);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `*SOLICITAÇÃO DE ORÇAMENTO - RESOLVE NOTEBOOK*\n\n` +
      `👤 *Nome:* ${customerName || 'Cliente'}\n` +
      `💻 *Marca:* ${brand || 'Não informado'}\n` +
      `⚙️ *Modelo:* ${model || 'Não especificado'}\n` +
      `🔧 *Serviço de interesse:* ${selectedService || 'Geral / Diagnóstico'}\n` +
      `📝 *Detalhes do defeito:* ${defect || 'Avaliação necessária'}\n\n` +
      `Olá, gostaria de saber o valor estimado e prazo de atendimento.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#12141c] border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 shrink-0 shadow-md">
            <img src={logoImg} alt="Resolve Notebook" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <Laptop className="w-3 h-3" /> Orçamento Rápido
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Solicitar Orçamento Grátis
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Receba estimativa rápida e tire dúvidas no WhatsApp da loja.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Seu Nome:
            </label>
            <input
              type="text"
              required
              placeholder="Ex: João da Silva"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition"
            />
          </div>

          {/* Marca */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Marca do Notebook:
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition cursor-pointer"
            >
              <option value="">Selecione a marca...</option>
              {brands.map((b) => (
                <option key={b} value={b} className="bg-zinc-900 text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Modelo ou Ano (opcional):
            </label>
            <input
              type="text"
              placeholder="Ex: Dell Inspiron 15, Acer Nitro 5, MacBook Air..."
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition"
            />
          </div>

          {/* Serviço Desejado */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Serviço Principal:
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition cursor-pointer"
            >
              <option value="">Selecione o serviço...</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.title} className="bg-zinc-900 text-white">
                  {s.title}
                </option>
              ))}
              <option value="Outro defeito ou não sei identificar" className="bg-zinc-900 text-white">
                Outro defeito ou não sei identificar
              </option>
            </select>
          </div>

          {/* Descrição do defeito */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              O que está acontecendo? (sintomas):
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Não liga, tela preta, esquentando muito, desligando sozinho..."
              value={defect}
              onChange={(e) => setDefect(e.target.value)}
              className="w-full bg-[#181a24] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-base py-3.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-black/10 stroke-[2.4]" />
              <span>Enviar para o WhatsApp</span>
            </button>
            <p className="text-center text-[11px] text-zinc-500 mt-2">
              Atendimento direto pelos técnicos da loja na Santa Ifigênia.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

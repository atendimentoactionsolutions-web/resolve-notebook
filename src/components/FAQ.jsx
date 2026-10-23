import React, { useState } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, ShieldCheck } from 'lucide-react';

const FAQS = [
  {
    q: 'Preciso agendar horário ou posso levar direto na loja física?',
    a: 'Não precisa agendar! Você pode vir direto na nossa loja física na Rua Santa Ifigênia, 361 – Loja 14 (Shopping 355). Atendemos de segunda a sexta das 9h às 18h e aos sábados das 9h às 15h. Seu equipamento é recebido com comprovante de entrada digital na hora.'
  },
  {
    q: 'Quanto tempo leva para ficar pronto o diagnóstico?',
    a: 'Problemas de software, limpeza preventiva e upgrades de SSD/RAM costumam ser finalizados no mesmo dia. Para diagnósticos eletrônicos complexos de placa-mãe ou notebooks que não ligam, o prazo médio de avaliação na bancada é de 24 a 48 horas úteis.'
  },
  {
    q: 'Vocês recuperam a placa-mãe sem precisar comprar outra?',
    a: 'Sim! Esse é o nosso maior diferencial na Santa Ifigênia. Dispomos de bancada de microeletrônica com microscópio térmico, estação de solda e osciloscópio. Localizamos curtos em componentes específicos (mosfets, capacitores, CI de carga) e trocamos apenas a peça defeituosa, economizando até 70% em relação à troca da placa inteira.'
  },
  {
    q: 'A carcaça quebrada na dobradiça volta a abrir normal sem quebrar de novo?',
    a: 'Com certeza. Não usamos cola simples. Fazemos ancoragem química com resina acrílica estrutural de alta densidade e realizamos o alívio de torque (pressão) nas dobradiças de aço. A tampa volta a abrir suave e macia com uma mão só, com resistência superior à original de fábrica.'
  },
  {
    q: 'Quais as garantias oferecidas pela Resolve Notebook?',
    a: 'Todos os nossos reparos possuem garantia legal mínima de 90 dias com emissão de nota e termo. Peças novas como SSDs e Memórias RAM possuem garantia de até 1 ano.'
  },
  {
    q: 'Quais as formas de pagamento aceitas?',
    a: 'Aceitamos PIX com desconto à vista, dinheiro, cartões de débito e parcelamento em até 12x no cartão de crédito em condições facilitadas.'
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Tenho uma dúvida sobre a assistência técnica da Resolve Notebook.'
  )}`;

  return (
    <section id="faq" className="py-20 bg-[#0b0c10] border-t border-zinc-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Dúvidas Frequentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes sobre a <span className="text-amber-400">Nossa Assistência</span>
          </h2>
          <p className="mt-3 text-base text-gray-400">
            Tudo o que você precisa saber antes de trazer seu equipamento na Santa Ifigênia.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="bg-[#12141c] border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-zinc-700"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/40 transition"
                >
                  <span className="font-bold text-sm sm:text-base text-white leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-amber-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-zinc-800/60 bg-[#0e1017]">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-[#141724] to-[#12141c] border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-white">
              Ficou com alguma dúvida específica sobre o seu modelo?
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Nossos técnicos respondem em minutos no WhatsApp.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-black/10 stroke-[2.2]" />
            <span>Tirar Dúvida no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}

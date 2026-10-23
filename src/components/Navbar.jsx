import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { SITE_CONFIG } from '../data/siteConfig';
import { getStoreStatus } from '../utils/storeStatus';
import { MessageCircle, Menu, X, PhoneCall } from 'lucide-react';

export default function Navbar({ onOpenQuote, onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const status = getStoreStatus();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Notebooks', href: '#vitrine' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Antes & Depois', href: '#casos' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contato', href: '#contato' },
  ];

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Vim pelo site da Resolve Notebook e gostaria de mais informações.'
  )}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-3.5'
          : 'bg-[#0b0c10]/80 backdrop-blur-sm border-b border-zinc-800/40 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo (Clique disfarçado abre o painel administrativo) */}
          <div 
            onClick={onOpenAdmin} 
            className="group cursor-pointer select-none py-1"
            title="Resolve Notebook"
          >
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-amber-400 transition-colors duration-200 relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-200 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </nav>

          {/* WhatsApp CTA Button & Live Status */}
          <div className="hidden sm:flex items-center gap-3">
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              status.isOpen 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span>{status.shortText}</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-sm px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_25px_rgba(245,158,11,0.55)] transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-black/10 stroke-[2.2]" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800 transition"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1015] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-amber-400 font-medium py-2 px-3 rounded-lg hover:bg-zinc-900/60 transition"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm px-5 py-3 rounded-xl shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4 fill-black/10" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

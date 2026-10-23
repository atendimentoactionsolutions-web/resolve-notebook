import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Products from './components/Products';
import BuySell from './components/BuySell';
import Corporate from './components/Corporate';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenQuote = () => {
    setSelectedService(null);
    setIsQuoteOpen(true);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Fixed Header */}
      <Navbar onOpenQuote={handleOpenQuote} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onOpenQuote={handleOpenQuote} />
        <Services onSelectService={handleSelectService} />
        <Products />
        <BuySell onOpenQuote={handleOpenQuote} />
        <Corporate />
        <About />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive WhatsApp Budget Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialService={selectedService}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}

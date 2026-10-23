import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NotebookShowcase from './components/NotebookShowcase';
import Services from './components/Services';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import Products from './components/Products';
import BuySell from './components/BuySell';
import Corporate from './components/Corporate';
import FAQ from './components/FAQ';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showcaseKey, setShowcaseKey] = useState(0);

  const handleOpenQuote = () => {
    setSelectedService(null);
    setIsQuoteOpen(true);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setIsQuoteOpen(true);
  };

  const handleRefreshShowcase = () => {
    setShowcaseKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Fixed Header */}
      <Navbar onOpenQuote={handleOpenQuote} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onOpenQuote={handleOpenQuote} onOpenAdmin={() => setIsAdminOpen(true)} />
        
        {/* Dynamic Notebooks Showcase with Live Stock */}
        <NotebookShowcase 
          key={showcaseKey} 
          onOpenAdmin={() => setIsAdminOpen(true)} 
        />

        {/* 20 Categories Master-Detail Services */}
        <Services onSelectService={handleSelectService} />

        {/* Real Cases Before & After Interactive Slider */}
        <div id="casos">
          <BeforeAfterSlider />
        </div>

        {/* Featured Products */}
        <Products />

        {/* Buy & Sell Banners */}
        <BuySell onOpenQuote={handleOpenQuote} />

        {/* B2B Solutions */}
        <Corporate />

        {/* Interactive FAQ Section */}
        <FAQ />

        {/* About Santa Ifigênia */}
        <About />

        {/* Customer Testimonials with Google 5.0 badge */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Interactive 3-Step WhatsApp Budget Wizard */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialService={selectedService}
      />

      {/* Admin Panel Modal for Managing Notebook Stock */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshCatalog={handleRefreshShowcase}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}

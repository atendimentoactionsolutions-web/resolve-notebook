import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { 
  Laptop, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  MessageCircle, 
  Tag, 
  Sparkles,
  Check,
  PlusCircle,
  Lock
} from 'lucide-react';

export default function NotebookShowcase({ onOpenAdmin }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.warn('Usando catálogo local:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ['Todos', 'Estudo & Trabalho', 'Corporativo', 'Gamer', 'MacBook'];

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'Todos') return true;
    return p.category === selectedCategory;
  });

  const handleBuyWhatsApp = (product) => {
    const formattedPrice = Number(product.price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const msg = `Olá! Vi no site da Resolve Notebook o modelo:\n\n` +
      `💻 *${product.title}*\n` +
      `💰 *Valor:* ${formattedPrice} (${product.installments || 'consulte parcelamento'})\n` +
      `🛡️ *Condição:* ${product.badge || 'Revisado com Garantia'}\n\n` +
      `Ele ainda está disponível para retirada na loja física do Shopping 355?`;

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="vitrine" className="py-20 bg-[#0c0d13] border-t border-zinc-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Pronta Entrega na Santa Ifigênia
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Notebooks <span className="text-amber-400">Revisados & Seminovos</span>
          </h2>
          <p className="mt-2 text-base text-gray-400 max-w-2xl">
            Máquinas selecionadas, 100% testadas em laboratório, higienizadas e com garantia de loja física no Shopping 355.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.35)] font-bold'
                  : 'bg-[#141620] text-gray-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            Carregando catálogo de notebooks...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#12141c] border border-zinc-800 rounded-3xl p-8">
            <Laptop className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Nenhum notebook nesta categoria no momento.</h4>
            <p className="text-xs text-gray-400 mt-1">
              Novos modelos chegam semanalmente na bancada da Santa Ifigênia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isSold = p.status === 'sold';
              const priceFormatted = Number(p.price).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              });

              return (
                <div
                  key={p.id}
                  className={`group bg-[#12141c] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    isSold 
                      ? 'border-zinc-800 opacity-60' 
                      : 'border-zinc-800 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:-translate-y-1'
                  }`}
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-[16/11] bg-zinc-950 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="inline-block bg-black/80 backdrop-blur-md border border-amber-400/30 text-amber-400 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        {p.badge || 'Revisado com Garantia'}
                      </span>
                    </div>

                    {/* Sold overlay */}
                    {isSold && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500/90 text-white font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                          Vendido
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {p.title}
                      </h3>

                      {/* Specs summary pills */}
                      {p.specs && (
                        <div className="mt-3.5 space-y-1.5 text-xs text-gray-300 border-t border-zinc-800/80 pt-3">
                          {p.specs.cpu && (
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">{p.specs.cpu}</span>
                            </div>
                          )}
                          {(p.specs.ram || p.specs.storage) && (
                            <div className="flex items-center gap-2">
                              <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">
                                {p.specs.ram} • {p.specs.storage}
                              </span>
                            </div>
                          )}
                          {p.specs.screen && (
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Laptop className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              <span className="truncate">{p.specs.screen}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description preview */}
                      {p.description && (
                        <p className="mt-2.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                    </div>

                    {/* Price and Action Button */}
                    <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col gap-3">
                      <div>
                        <div className="text-2xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                          {priceFormatted}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {p.installments || 'ou até 12x no cartão'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyWhatsApp(p)}
                        disabled={isSold}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition ${
                          isSold
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.45)] cursor-pointer'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 fill-black/10 stroke-[2.2]" />
                        <span>{isSold ? 'Indisponível' : 'Tenho Interesse'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

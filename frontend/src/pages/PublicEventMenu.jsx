import React from 'react';
import { useMenu, formatPrice } from '../hooks/useMenu';
import { Sparkles, ArrowLeft, Printer, ShieldAlert, Loader2 } from 'lucide-react';

export default function PublicEventMenu() {
  const { menu, settings, loading, error } = useMenu(true, true); // true, true for available event items

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-[#D4AF37] mb-4" size={40} />
        <p className="text-xs uppercase tracking-luxurious text-[#A1A1AA]">Caricamento Menù Evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col items-center justify-center p-6 text-center font-sans">
        <ShieldAlert className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-display text-white mb-2">Errore di Connessione</h2>
        <p className="text-sm text-[#A1A1AA] max-w-sm mb-6">{error}</p>
        <a href="#/menu" className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition duration-300 uppercase tracking-luxurious text-xs font-semibold rounded-sm">
          Torna al Menù Classico
        </a>
      </div>
    );
  }

  const { items } = menu;

  // Dynamic Background Style
  const bgImage = settings.background_path || '';
  const bgOpacity = parseFloat(settings.background_opacity) ?? 0.3;
  const bgSize = settings.background_size || 'cover';
  const bgPos = settings.background_position || 'center';

  const backgroundStyle = bgImage ? {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: bgSize,
    backgroundPosition: bgPos,
    backgroundAttachment: 'fixed',
    opacity: bgOpacity,
  } : {};

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] font-sans relative flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      
      {/* Background layer */}
      {bgImage && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={backgroundStyle}
        ></div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C] via-[#0B0B0C]/90 to-[#0B0B0C] z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full flex-grow">
        
        {/* Top bar with back link */}
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <a href="#/menu" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxurious text-[#A1A1AA] hover:text-[#D4AF37] transition">
            <ArrowLeft size={14} /> Torna al Menù Classico
          </a>
        </div>

        {/* Brand Header */}
        <header className="max-w-4xl mx-auto px-6 py-12 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] font-bold px-4 py-2 uppercase tracking-wider rounded-full">
              <Sparkles size={12} /> Evento Speciale
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-light text-white tracking-wide">
            {settings.event_name || 'Evento Speciale'}
          </h1>
          
          {settings.event_subtitle && (
            <p className="text-xs md:text-sm tracking-luxurious font-light text-[#A1A1AA] uppercase max-w-lg mx-auto">
              {settings.event_subtitle}
            </p>
          )}

          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
          
          <p className="text-[10px] text-[#A1A1AA] uppercase tracking-luxurious">
            Presso {settings.restaurant_name || 'CapClub - Café & Bistrot'}
          </p>
        </header>

        {/* Menu Listings */}
        <main className="max-w-xl mx-auto px-6 pb-20 mt-8 space-y-8">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-light text-[#A1A1AA] italic">Nessun piatto speciale è inserito in questo evento.</p>
            </div>
          ) : (
            <div className="border border-[#27272A] bg-[#121214]/65 backdrop-blur-md p-8 md:p-12 rounded-sm space-y-8 shadow-2xl">
              {items.map(item => (
                <div key={item.id} className="group space-y-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display font-medium text-base text-[#E4E4E7] group-hover:text-[#D4AF37] transition duration-300">
                      {item.title}
                    </h3>
                    <div className="flex-grow border-b border-dotted border-[#27272A]/80 group-hover:border-[#D4AF37]/20 transition duration-300 mx-2"></div>
                    <span className="font-sans font-medium text-sm text-[#D4AF37]">
                      {formatPrice(item.price, settings.currency_symbol)}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs font-light text-[#A1A1AA] italic leading-relaxed pr-10">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#27272A]/50 bg-[#121214]/30 py-8 text-center text-[10px] text-[#A1A1AA] font-light space-y-4">
        <div className="flex justify-center space-x-6 uppercase tracking-luxurious font-semibold text-[9px]">
          <a href="#/admin" className="hover:text-[#D4AF37] transition">Area Riservata</a>
          <span>•</span>
          <a href="#/print-event" className="inline-flex items-center gap-1 hover:text-[#D4AF37] transition">
            <Printer size={10} /> Stampa Menù Evento (A4)
          </a>
        </div>
      </footer>

    </div>
  );
}

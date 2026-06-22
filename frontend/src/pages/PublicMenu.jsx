import React, { useState } from 'react';
import { useMenu, formatPrice, getOrderedSections } from '../hooks/useMenu';
import { Sparkles, ArrowLeft, Printer, ShieldAlert, Loader2 } from 'lucide-react';

export default function PublicMenu() {
  const { menu, settings, loading, error } = useMenu(true, false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-[#D4AF37] mb-4" size={40} />
        <p className="text-xs uppercase tracking-luxurious text-[#A1A1AA]">Caricamento Menù Esclusivo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col items-center justify-center p-6 text-center font-sans">
        <ShieldAlert className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-display text-white mb-2">Errore di Connessione</h2>
        <p className="text-sm text-[#A1A1AA] max-w-sm mb-6">{error}</p>
        <a href="#/" className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition duration-300 uppercase tracking-luxurious text-xs font-semibold rounded-sm">
          Torna alla Home
        </a>
      </div>
    );
  }

  const { grouped, sections: rawSections } = menu;
  const orderedSections = getOrderedSections(rawSections, settings);

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

  // Accent color variables
  const accentColor = settings.accent_color || '#D4AF37';

  // Get active items to display
  const displaySections = activeCategory === 'ALL' 
    ? orderedSections 
    : [activeCategory];

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
        <div className="max-w-4xl mx-auto px-6 pt-6 flex items-center justify-between">
          <a href="#/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxurious text-[#A1A1AA] hover:text-[#D4AF37] transition">
            <ArrowLeft size={14} /> Back to Home
          </a>
          
          {settings.event_name && (
            <a href="#/eventi" className="inline-flex items-center gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-full hover:bg-[#D4AF37]/20 transition">
              <Sparkles size={10} /> Menù Evento: {settings.event_name}
            </a>
          )}
        </div>

        {/* Brand Header */}
        <header className="max-w-4xl mx-auto px-6 py-12 text-center space-y-6">
          {settings.logo_path && (
            <div className="flex justify-center mb-4">
              <img 
                src={settings.logo_path} 
                alt="CapClub Logo" 
                className="max-h-24 object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.2)]"
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-display font-light text-white tracking-wide">
            {settings.restaurant_name || 'CapClub - Café & Bistrot'}
          </h1>
          
          {settings.restaurant_subtitle && (
            <p className="text-xs md:text-sm tracking-luxurious font-light text-[#A1A1AA] uppercase max-w-lg mx-auto">
              {settings.restaurant_subtitle}
            </p>
          )}

          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
        </header>

        {/* Category sticky filter */}
        <div className="sticky top-0 z-30 bg-[#0B0B0C]/85 backdrop-blur-md border-y border-[#27272A]/50 py-4 mb-10 overflow-x-auto scrollbar-none">
          <div className="max-w-4xl mx-auto px-6 flex space-x-3 md:justify-center whitespace-nowrap">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-luxurious transition-all duration-300 rounded-full border ${
                activeCategory === 'ALL' 
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0B0C]' 
                  : 'bg-transparent border-[#27272A] text-[#A1A1AA] hover:border-[#D4AF37]/45 hover:text-[#E4E4E7]'
              }`}
            >
              Tutto
            </button>
            {orderedSections.map(sec => (
              <button
                key={sec}
                onClick={() => setActiveCategory(sec)}
                className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-luxurious transition-all duration-300 rounded-full border ${
                  activeCategory === sec 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0B0C]' 
                    : 'bg-transparent border-[#27272A] text-[#A1A1AA] hover:border-[#D4AF37]/45 hover:text-[#E4E4E7]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Listings */}
        <main className="max-w-3xl mx-auto px-6 pb-20 space-y-16">
          {displaySections.length === 0 || orderedSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-light text-[#A1A1AA] italic">Il menù è in fase di aggiornamento esclusivo.</p>
            </div>
          ) : (
            displaySections.map(section => {
              const items = grouped[section] || [];
              if (items.length === 0) return null;
              
              return (
                <section key={section} className="space-y-6">
                  {/* Section Title */}
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-wide shrink-0">
                      {section}
                    </h2>
                    <div className="flex-grow h-[1px] bg-gradient-to-r from-[#D4AF37]/30 to-transparent"></div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-6">
                    {items.map(item => (
                      <div key={item.id} className="group space-y-1">
                        {/* Title & Price dot row */}
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-display font-medium text-base text-[#E4E4E7] group-hover:text-[#D4AF37] transition duration-300">
                            {item.title}
                          </h3>
                          <div className="flex-grow border-b border-dotted border-[#27272A] group-hover:border-[#D4AF37]/20 transition duration-300 mx-2"></div>
                          <span className="font-sans font-medium text-sm text-[#D4AF37]">
                            {formatPrice(item.price, settings.currency_symbol)}
                          </span>
                        </div>

                        {/* Description */}
                        {item.description && (
                          <p className="text-xs font-light text-[#A1A1AA] italic leading-relaxed pr-10">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#27272A]/50 bg-[#121214]/30 py-8 text-center text-[10px] text-[#A1A1AA] font-light space-y-4">
        <p>
          Si prega di segnalare eventuali allergie alimentari al nostro personale prima dell'ordinazione.
        </p>
        <div className="flex justify-center space-x-6 uppercase tracking-luxurious font-semibold text-[9px]">
          <a href="#/admin" className="hover:text-[#D4AF37] transition">Area Riservata</a>
          <span>•</span>
          <a href="#/print" className="inline-flex items-center gap-1 hover:text-[#D4AF37] transition">
            <Printer size={10} /> Versione Stampabile (A4)
          </a>
        </div>
      </footer>

    </div>
  );
}

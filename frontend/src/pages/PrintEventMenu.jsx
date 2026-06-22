import React, { useState, useRef, useEffect } from 'react';
import { useMenu } from '../hooks/useMenu';
import { useReactToPrint } from 'react-to-print';
import PrintableMenu from '../components/PrintableMenu';
import { ArrowLeft, Printer, CheckSquare, Square, Loader2 } from 'lucide-react';

export default function PrintEventMenu() {
  const { menu, settings, loading, error } = useMenu(true, true); // true, true for available event items
  const [selectedSections, setSelectedSections] = useState([]);
  const [sectionPerPage, setSectionPerPage] = useState(false);
  const [paperColor, setPaperColor] = useState('#FFFFFF');
  const [paperOpacity, setPaperOpacity] = useState(1);
  const [paperIntensity, setPaperIntensity] = useState(1);
  
  const componentRef = useRef(null);

  const { sections } = menu;

  // Initialize selected sections when menu loads
  useEffect(() => {
    if (sections && sections.length > 0) {
      setSelectedSections(sections);
    }
  }, [sections]);

  // Synchronize paper settings with db settings when loaded
  useEffect(() => {
    if (settings) {
      if (settings.print_paper_color) setPaperColor(settings.print_paper_color);
      if (settings.print_paper_opacity) setPaperOpacity(parseFloat(settings.print_paper_opacity) || 1);
      if (settings.print_paper_intensity) setPaperIntensity(parseFloat(settings.print_paper_intensity) || 1);
    }
  }, [settings]);

  // Print helper
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: settings.event_name || 'CapClub Event Menu',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-[#D4AF37] mb-4" size={40} />
        <p className="text-xs uppercase tracking-luxurious text-[#A1A1AA]">Caricamento Anteprima Menù Evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-display text-white mb-2">Errore</h2>
        <p className="text-sm text-[#A1A1AA] mb-6">{error}</p>
        <a href="#/admin" className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition uppercase tracking-luxurious text-xs font-semibold rounded-sm">
          Torna all'Admin
        </a>
      </div>
    );
  }

  const handleToggleSection = (section) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const applyPresetAll = () => setSelectedSections(sections);
  const applyPresetNone = () => setSelectedSections([]);

  const marginMm = settings.print_margin_mm || '15';
  const fontSizePt = settings.print_font_size_pt || '11';

  const getPaperBackground = (hex, opacity, intensity) => {
    let c = hex.substring(1);
    let rgb = parseInt(c, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = (rgb >> 0) & 0xff;
    
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    s = Math.min(1, s * intensity);
    l = Math.min(1, l * intensity);
    
    return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${opacity})`;
  };

  const computedBgColor = getPaperBackground(paperColor, paperOpacity, paperIntensity);

  const styleVariables = {
    '--print-margin': `${marginMm}mm`,
    '--print-font-size': `${fontSizePt}pt`,
    '--print-paper-bg': computedBgColor,
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col md:flex-row relative font-sans selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      
      {/* Control Sidebar */}
      <aside className="no-print w-full md:w-80 bg-[#121214] border-b md:border-b-0 md:border-r border-[#27272A] p-6 space-y-8 shrink-0">
        <div className="space-y-1">
          <a href="#/admin" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxurious text-[#A1A1AA] hover:text-[#D4AF37] transition">
            <ArrowLeft size={14} /> Torna all'Admin
          </a>
          <h1 className="text-xl font-display text-white">Stampa Menù Evento</h1>
        </div>

        {/* Section selectors */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Categorie da Includere</h2>
          <div className="space-y-2">
            {sections.map(sec => {
              const isChecked = selectedSections.includes(sec);
              return (
                <button
                  key={sec}
                  onClick={() => handleToggleSection(sec)}
                  className="w-full flex items-center gap-3 text-xs text-left hover:text-white transition group py-1"
                >
                  <span className="text-[#D4AF37]">
                    {isChecked ? <CheckSquare size={16} /> : <Square size={16} className="text-[#A1A1AA]" />}
                  </span>
                  <span className={isChecked ? 'text-white' : 'text-[#A1A1AA]'}>{sec}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={applyPresetAll} className="py-2 bg-[#0B0B0C] border border-[#27272A] text-[9px] uppercase font-bold tracking-wider text-[#A1A1AA] hover:text-white rounded-sm">Tutto</button>
            <button onClick={applyPresetNone} className="py-2 bg-[#0B0B0C] border border-[#27272A] text-[9px] uppercase font-bold tracking-wider text-[#A1A1AA] hover:text-white rounded-sm">Nessuno</button>
          </div>
        </div>

        {/* Page Breaks */}
        <div className="space-y-4 border-t border-[#27272A] pt-6">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Opzioni Impaginazione</h2>
          <button 
            onClick={() => setSectionPerPage(!sectionPerPage)}
            className="w-full flex items-center gap-3 text-xs text-left hover:text-white transition group"
          >
            <span className="text-[#D4AF37]">
              {sectionPerPage ? <CheckSquare size={16} /> : <Square size={16} className="text-[#A1A1AA]" />}
            </span>
            <span className={sectionPerPage ? 'text-white' : 'text-[#A1A1AA]'}>Spezza sezioni su nuove pagine</span>
          </button>
        </div>

        {/* Print Trigger */}
        <div className="pt-4 border-t border-[#27272A]">
          <button 
            onClick={handlePrint}
            className="w-full py-4 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition rounded-sm flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Avvia Stampa A4
          </button>
          <p className="text-[9px] text-[#A1A1AA]/60 text-center mt-3">
            Abilita la stampa di sfondi ed immagini nel browser.
          </p>
        </div>
      </aside>

      {/* Main Preview Container */}
      <main className="flex-grow p-8 flex justify-center items-start overflow-y-auto max-h-screen">
        
        {/* Printable/Preview area wrapper */}
        <div 
          className="print-preview-container print:p-0 print:m-0"
          style={styleVariables}
        >
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[var(--print-margin)] shadow-2xl border border-gray-800 print:border-none print:shadow-none relative">
            <PrintableMenu 
              ref={componentRef} 
              menu={menu}
              settings={settings}
              selectedSections={selectedSections}
              sectionPerPage={sectionPerPage}
              isEvent={true}
            />
          </div>
        </div>

      </main>

    </div>
  );
}

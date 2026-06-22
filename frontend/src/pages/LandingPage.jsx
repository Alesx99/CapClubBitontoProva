import React, { useState, useRef } from 'react';
import { 
  Utensils, Trophy, Sparkles, Smile, Loader2, Calendar, Clock, 
  User, Mail, Phone, MessageSquare, Shield, CheckCircle2, ChevronRight, Menu, X
} from 'lucide-react';
import { api } from '../api/client';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Tavolo Bistrot',
    date: '',
    time: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bookingFormRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectBookingType = (type, notesPreset = '') => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      notes: notesPreset ? `${prev.notes} ${notesPreset}`.trim() : prev.notes
    }));
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.createBooking(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'Tavolo Bistrot',
        date: '',
        time: '',
        notes: ''
      });
    } catch (err) {
      setError(err.message || 'Si è verificato un errore durante la prenotazione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] font-sans selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B0B0C]/80 backdrop-blur-md border-b border-[#27272A]/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => scrollToSection('hero')}>
            <span className="font-display text-2xl font-bold tracking-widest text-[#D4AF37]">CAPCLUB</span>
            <span className="text-[9px] font-sans tracking-[0.25em] text-[#A1A1AA] uppercase -mt-1">Café, Sport & Private</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-luxurious text-[#A1A1AA]">
            <button onClick={() => scrollToSection('bistrot')} className="hover:text-[#D4AF37] transition duration-300">Il Bistrot</button>
            <button onClick={() => scrollToSection('sports')} className="hover:text-[#D4AF37] transition duration-300">Sport Arena</button>
            <button onClick={() => scrollToSection('events')} className="hover:text-[#D4AF37] transition duration-300">Kids & Eventi</button>
            <button onClick={() => scrollToSection('booking')} className="hover:text-[#D4AF37] transition duration-300">Riserva</button>
            <a href="#/menu" className="px-5 py-2.5 border border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition duration-300 font-semibold tracking-luxurious rounded-sm">
              Il Menù
            </a>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#E4E4E7] hover:text-[#D4AF37] transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#121214] border-b border-[#27272A] p-6 flex flex-col space-y-4 text-center font-semibold text-xs tracking-luxurious uppercase text-[#A1A1AA]">
            <button onClick={() => scrollToSection('bistrot')} className="py-2 hover:text-[#D4AF37] transition">Il Bistrot</button>
            <button onClick={() => scrollToSection('sports')} className="py-2 hover:text-[#D4AF37] transition">Sport Arena</button>
            <button onClick={() => scrollToSection('events')} className="py-2 hover:text-[#D4AF37] transition">Kids & Eventi</button>
            <button onClick={() => scrollToSection('booking')} className="py-2 hover:text-[#D4AF37] transition">Riserva</button>
            <a href="#/menu" className="block py-3 border border-[#D4AF37] text-[#D4AF37] rounded-sm transition">
              Il Menù
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
        {/* Editorial Background Image with overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/75 to-black/60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0B0B0C_95%)]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-semibold tracking-[0.4em] text-[#D4AF37] uppercase mb-4 animate-fade-in">
            SUPER EXCLUSIVE COUNTRY CLUB
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-light text-[#E4E4E7] tracking-wider mb-6">
            CapClub
          </h1>
          <p className="text-sm md:text-lg font-sans font-light tracking-luxurious text-[#A1A1AA] max-w-2xl mx-auto mb-12">
            Café, Sport & Private Club. Un'oasi di raffinatezza, sport esclusivi e alta gastronomia immersa in un ambiente lussuoso e riservato.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#/menu" 
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition-all duration-300 shadow-lg shadow-[#D4AF37]/10"
            >
              Scopri il Menù
            </a>
            <button 
              onClick={() => {
                if (bookingFormRef.current) {
                  bookingFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="w-full sm:w-auto px-8 py-4 border border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#D4AF37] font-semibold text-xs uppercase tracking-luxurious transition-all duration-300"
            >
              Riserva un Tavolo / Campo
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer" onClick={() => scrollToSection('bistrot')}>
          <span className="text-[9px] uppercase tracking-luxurious text-[#A1A1AA] mb-2">Esplora</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* The Bistrot Section */}
      <section id="bistrot" className="py-24 md:py-32 relative overflow-hidden bg-[#0B0B0C] border-b border-[#27272A]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Storytelling Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
                Gastronomia d'Eccellenza
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-[#E4E4E7] leading-tight">
                The Bistrot
              </h2>
              <div className="w-16 h-[2px] bg-[#D4AF37]"></div>
              
              <p className="text-sm leading-relaxed text-[#A1A1AA] font-light">
                Al CapClub Bistrot, l'arte culinaria incontra l'esclusività. Il nostro menù è un viaggio gourmet firmato da chef di fama internazionale, guidato dalla ricerca instancabile delle migliori materie prime locali e tagli pregiati d'importazione.
              </p>
              
              <p className="text-sm leading-relaxed text-[#A1A1AA] font-light">
                Dalle raffinate crudités di mare pescato in giornata, alle selezioni premium di carni dal mondo, ogni portata viene pensata per essere abbinata a cocktail d'autore innovativi o a etichette esclusive della nostra cantina privata.
              </p>

              <div className="pt-6">
                <a 
                  href="#/menu" 
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-luxurious text-[#D4AF37] uppercase hover:text-[#C5A059] transition"
                >
                  Visualizza la selezione di oggi <ChevronRight size={14} />
                </a>
              </div>
            </div>

            {/* Editorial Images Grid */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent blur-3xl rounded-full z-0"></div>
              
              <div className="col-span-8 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
                  alt="Taglio di carne premium" 
                  className="rounded-sm border border-[#27272A] w-full object-cover h-80 brightness-90 shadow-2xl"
                />
              </div>
              <div className="col-span-4 self-end relative z-10 -ml-8 mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600" 
                  alt="Cocktail d'autore" 
                  className="rounded-sm border border-[#27272A] w-full object-cover h-48 brightness-95 shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sport Arena Section */}
      <section id="sports" className="py-24 md:py-32 bg-[#121214] relative border-b border-[#27272A]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
              Benessere, Competizione, Passione
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-[#E4E4E7]">
              Sport Arena
            </h2>
            <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto"></div>
            <p className="text-xs text-[#A1A1AA] font-light tracking-luxurious">
              Campi d'eccellenza, attrezzature high-tech e spogliatoi VIP per un'esperienza atletica senza compromessi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card Padel */}
            <div className="bg-[#0B0B0C] border border-[#27272A]/80 hover:border-[#D4AF37]/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="h-44 relative bg-[url('https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37]/20 border border-[#D4AF37]/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    PANORAMICO
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-xl text-[#E4E4E7]">Campi da Padel</h3>
                  <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
                    Campi panoramici di ultima generazione con vetrate strutturali e manto sintetico testato WPT per rimbalzi perfetti.
                  </p>
                  <ul className="text-[11px] text-[#D4AF37]/90 space-y-1 pt-2 font-light">
                    <li>✦ Spogliatoi VIP & docce calde</li>
                    <li>✦ Asciugamani di spugna inclusi</li>
                    <li>✦ Noleggio racchette pro</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => selectBookingType('Campo Padel')}
                  className="w-full py-3 bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition-all duration-300 rounded-sm"
                >
                  Prenota Campo
                </button>
              </div>
            </div>

            {/* Card Beach Volley */}
            <div className="bg-[#0B0B0C] border border-[#27272A]/80 hover:border-[#D4AF37]/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="h-44 relative bg-[url('https://images.unsplash.com/photo-1533854775446-65c4a3f5d8fe?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37]/20 border border-[#D4AF37]/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    SABBIA RISCALDATA
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-xl text-[#E4E4E7]">Beach Volley</h3>
                  <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
                    Gioca tutto l'anno sulla nostra sabbia finissima riscaldata e filtrata costantemente, in un ambiente coperto d'inverno.
                  </p>
                  <ul className="text-[11px] text-[#D4AF37]/90 space-y-1 pt-2 font-light">
                    <li>✦ Sabbia bianca anti-trauma</li>
                    <li>✦ Illuminazione notturna a LED pro</li>
                    <li>✦ Area bar relax a bordo campo</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => selectBookingType('Beach Volley')}
                  className="w-full py-3 bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition-all duration-300 rounded-sm"
                >
                  Prenota Campo
                </button>
              </div>
            </div>

            {/* Card Calcio */}
            <div className="bg-[#0B0B0C] border border-[#27272A]/80 hover:border-[#D4AF37]/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="h-44 relative bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37]/20 border border-[#D4AF37]/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    ERBA SINTETICA PRO
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-xl text-[#E4E4E7]">Calcio a 5 / 8</h3>
                  <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
                    Sfide veloci e professionali su campi rivestiti in erba sintetica di ultima generazione omologata LND ad alto assorbimento.
                  </p>
                  <ul className="text-[11px] text-[#D4AF37]/90 space-y-1 pt-2 font-light">
                    <li>✦ Pallone e pettorine fornite</li>
                    <li>✦ Docce e spogliatoi VIP dedicati</li>
                    <li>✦ Terzo tempo riservato al bistrot</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => selectBookingType('Calcio')}
                  className="w-full py-3 bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition-all duration-300 rounded-sm"
                >
                  Prenota Campo
                </button>
              </div>
            </div>

            {/* Card Fitness */}
            <div className="bg-[#0B0B0C] border border-[#27272A]/80 hover:border-[#D4AF37]/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="h-44 relative bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37]/20 border border-[#D4AF37]/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    HIGH-TECH AREA
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-xl text-[#E4E4E7]">Fitness & Palestra</h3>
                  <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
                    Spazio fitness riservato dotato di macchine cardio/isotoniche Technogym di ultima generazione con bio-feedback integrato.
                  </p>
                  <ul className="text-[11px] text-[#D4AF37]/90 space-y-1 pt-2 font-light">
                    <li>✦ Personal training su richiesta</li>
                    <li>✦ Programmi metabolici personalizzati</li>
                    <li>✦ Wellness water & integratori bar</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => selectBookingType('Tavolo Bistrot', 'Richiesta sessione fitness / palestra')}
                  className="w-full py-3 bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition-all duration-300 rounded-sm"
                >
                  Richiedi Info
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Kids & Events Section */}
      <section id="events" className="py-24 md:py-32 relative overflow-hidden bg-[#0B0B0C] border-b border-[#27272A]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image section first on desktop for variety */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative order-last lg:order-first">
              <div className="absolute -inset-4 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent blur-3xl rounded-full z-0"></div>
              
              <div className="col-span-8 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800" 
                  alt="Festa bambini elegante" 
                  className="rounded-sm border border-[#27272A] w-full object-cover h-80 brightness-90 shadow-2xl"
                />
              </div>
              <div className="col-span-4 self-start relative z-10 -ml-4 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600" 
                  alt="Festa esclusiva" 
                  className="rounded-sm border border-[#27272A] w-full object-cover h-48 brightness-95 shadow-2xl"
                />
              </div>
            </div>

            {/* Storytelling Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
                Famiglia & Feste Private
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-[#E4E4E7] leading-tight">
                Kids & Events
              </h2>
              <div className="w-16 h-[2px] bg-[#D4AF37]"></div>
              
              <p className="text-sm leading-relaxed text-[#A1A1AA] font-light">
                Il CapClub è un'esperienza per tutta la famiglia. Abbiamo dedicato uno spazio verde sicuro e sorvegliato con gonfiabili e playground all'avanguardia per i vostri bambini, gestito da animatori professionisti qualificati.
              </p>
              
              <p className="text-sm leading-relaxed text-[#A1A1AA] font-light">
                Per celebrare i momenti importanti, offriamo l'organizzazione di feste private ed eventi speciali con pacchetti personalizzati d'eccellenza, adatti a soddisfare ogni esigenza.
              </p>

              {/* Package cards */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                
                <div className="border border-[#27272A] bg-[#121214] p-4 text-center rounded-sm hover:border-[#D4AF37]/50 transition duration-300">
                  <h4 className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Silver</h4>
                  <p className="text-[9px] text-[#A1A1AA]/70 mt-1">Playground + buffet base</p>
                  <button 
                    onClick={() => selectBookingType('Festa Bambini', 'Pacchetto Richiesto: SILVER CLUB')}
                    className="mt-3 text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider hover:text-white transition"
                  >
                    Seleziona
                  </button>
                </div>

                <div className="border border-[#D4AF37]/30 bg-[#121214] p-4 text-center rounded-sm hover:border-[#D4AF37] transition duration-300 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-[7px] text-[#0B0B0C] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    POPULAR
                  </div>
                  <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">Gold Club</h4>
                  <p className="text-[9px] text-[#A1A1AA]/70 mt-1">Animazione + buffet vip</p>
                  <button 
                    onClick={() => selectBookingType('Festa Bambini', 'Pacchetto Richiesto: GOLD CLUB')}
                    className="mt-3 text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider hover:text-white transition"
                  >
                    Seleziona
                  </button>
                </div>

                <div className="border border-[#27272A] bg-[#121214] p-4 text-center rounded-sm hover:border-[#D4AF37]/50 transition duration-300">
                  <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">Platinum</h4>
                  <p className="text-[9px] text-[#A1A1AA]/70 mt-1">Show privato + menu gourmet</p>
                  <button 
                    onClick={() => selectBookingType('Festa Bambini', 'Pacchetto Richiesto: PLATINUM CLUB')}
                    className="mt-3 text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider hover:text-white transition"
                  >
                    Seleziona
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Exclusive Booking System */}
      <section id="booking" ref={bookingFormRef} className="py-24 md:py-32 bg-[#121214] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.03)_0%,transparent_70%)]"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-12 space-y-4">
            <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
              Riserva la tua esperienza
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-[#E4E4E7]">
              Club Booking
            </h2>
            <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto"></div>
            <p className="text-xs text-[#A1A1AA] font-light max-w-md mx-auto leading-relaxed">
              Invia una richiesta di prenotazione. Ogni richiesta viene valutata singolarmente per garantire un servizio impeccabile ed esclusivo.
            </p>
          </div>

          <div className="bg-[#0B0B0C] border border-[#27272A] p-8 md:p-12 rounded-sm shadow-2xl relative">
            
            {success ? (
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-2 animate-scale-up">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-display text-white">Richiesta Inviata</h3>
                <p className="text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                  La tua richiesta di prenotazione è in attesa di approvazione esclusiva. Riceverai un'email di conferma all'indirizzo fornito una volta verificata la disponibilità.
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] font-semibold text-xs tracking-luxurious uppercase transition duration-300 rounded-sm"
                  >
                    Effettua un'altra prenotazione
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-xs rounded-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                        <User size={14} />
                      </span>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="E.g. Alessio Rossi"
                        className="w-full bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] focus:ring-0 text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Indirizzo Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                        <Mail size={14} />
                      </span>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="E.g. alessio@example.com"
                        className="w-full bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] focus:ring-0 text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Phone field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Recapito Telefonico
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                        <Phone size={14} />
                      </span>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="E.g. +39 345 678901"
                        className="w-full bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] focus:ring-0 text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Type of booking */}
                  <div className="space-y-2">
                    <label htmlFor="type" className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Tipo di Prenotazione
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                        <Shield size={14} />
                      </span>
                      <select 
                        id="type" 
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] focus:ring-0 text-sm text-[#E4E4E7] pl-10 pr-10 py-3 rounded-sm outline-none appearance-none transition"
                      >
                        <option value="Tavolo Bistrot">Tavolo Bistrot</option>
                        <option value="Campo Padel">Campo Padel</option>
                        <option value="Beach Volley">Campo Beach Volley</option>
                        <option value="Calcio">Campo da Calcio</option>
                        <option value="Festa Bambini">Festa Bambini / Private Event</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A1A1AA]/50 pointer-events-none">
                        <ChevronRight size={14} className="rotate-90" />
                      </span>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Date field */}
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Data
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                        <Calendar size={14} />
                      </span>
                      <input 
                        type="date" 
                        id="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] focus:ring-0 text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Time field */}
                  <div className="space-y-2">
                    <label htmlFor="time" className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Orario
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                        <Clock size={14} />
                      </span>
                      <input 
                        type="time" 
                        id="time" 
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] focus:ring-0 text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                </div>

                {/* Special notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    Note Speciali & Richieste
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-[#A1A1AA]/50">
                      <MessageSquare size={14} />
                    </span>
                    <textarea 
                      id="notes" 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Fornisci dettagli sul numero di partecipanti, allergie alimentari, preferenze tavoli, o pacchetti compleanno scelti..."
                      className="w-full bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] focus:ring-0 text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#C5A059] disabled:bg-[#D4AF37]/50 text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition duration-300 flex items-center justify-center gap-2 rounded-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-[#0B0B0C]" />
                        Elaborazione Richiesta Esclusiva...
                      </>
                    ) : (
                      'Invia Richiesta di Prenotazione'
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-[#0B0B0C] border-t border-[#27272A] py-16 text-center text-xs text-[#A1A1AA] font-light space-y-6">
        <div className="flex flex-col items-center">
          <span className="font-display text-xl font-bold tracking-widest text-[#D4AF37] mb-1">CAPCLUB</span>
          <span className="text-[8px] uppercase tracking-luxurious text-[#A1A1AA]">Café, Sport & Private Club</span>
        </div>
        <p className="max-w-md mx-auto px-6 text-[#A1A1AA]/70">
          Via del Club dell'Oro, 1 - Roma | Telefono: +39 06 9876543 | info@capclub.it
        </p>
        <div className="flex justify-center space-x-6 uppercase tracking-luxurious text-[10px] font-semibold pt-4">
          <a href="#/menu" className="hover:text-[#D4AF37] transition">Menù Bistrot</a>
          <a href="#/admin" className="hover:text-[#D4AF37] transition">Area Riservata</a>
        </div>
        <p className="text-[10px] text-[#A1A1AA]/40 pt-8">
          &copy; {new Date().getFullYear()} CapClub. Tutti i diritti riservati. Design Raffinato & Premium.
        </p>
      </footer>

    </div>
  );
}

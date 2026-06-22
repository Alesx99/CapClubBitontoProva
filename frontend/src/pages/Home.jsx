import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronRight, ArrowRight, Utensils, Trophy, Calendar, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/75 to-black/60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0B0B0C_95%)]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-[11px] font-semibold tracking-[0.4em] text-[#D4AF37] uppercase animate-fade-in">
            SUPER EXCLUSIVE COUNTRY CLUB
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-light text-[#E4E4E7] tracking-wider animate-scale-up">
            CapClub
          </h1>
          <p className="text-sm md:text-lg font-sans font-light tracking-luxurious text-[#A1A1AA] max-w-2xl mx-auto mb-8 leading-relaxed">
            Café, Sport & Private Club. Un'oasi di raffinatezza, sport esclusivi e alta gastronomia immersa in un ambiente lussuoso e riservato.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/prenota" 
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition-all duration-300 shadow-lg shadow-[#D4AF37]/10"
            >
              Riserva un'Esperienza
            </Link>
            <Link 
              to="/chi-siamo"
              className="w-full sm:w-auto px-8 py-4 border border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#D4AF37] font-semibold text-xs uppercase tracking-luxurious transition-all duration-300"
            >
              Scopri il Club
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-luxurious text-[#A1A1AA] mb-2">Esplora le Aree</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Grid of Main Sections */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bistrot Card */}
          <div className="group relative h-96 overflow-hidden border border-[#27272A] rounded-sm bg-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37]">
                <Utensils size={18} />
              </div>
              <h2 className="text-2xl font-display text-white">The Bistrot</h2>
              <p className="text-xs text-[#A1A1AA] max-w-sm font-light leading-relaxed">
                Viaggi gourmet firmati da chef internazionali, crudi di mare freschi e una selezione imperiale di carni dal mondo.
              </p>
              <div className="pt-2">
                <Link to="/bistrot" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-luxurious text-[#D4AF37] hover:text-white transition">
                  Esplora il Ristorante <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Sport Arena Card */}
          <div className="group relative h-96 overflow-hidden border border-[#27272A] rounded-sm bg-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37]">
                <Trophy size={18} />
              </div>
              <h2 className="text-2xl font-display text-white">Sport Arena</h2>
              <p className="text-xs text-[#A1A1AA] max-w-sm font-light leading-relaxed">
                Campi panoramici da padel, beach volley su sabbia riscaldata, campi da calcio pro ed un'area fitness d'avanguardia.
              </p>
              <div className="pt-2">
                <Link to="/sport" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-luxurious text-[#D4AF37] hover:text-white transition">
                  Esplora l'Arena <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Kids & Events Card */}
          <div className="group relative h-96 overflow-hidden border border-[#27272A] rounded-sm bg-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37]">
                <Sparkles size={18} />
              </div>
              <h2 className="text-2xl font-display text-white">Kids & Eventi</h2>
              <p className="text-xs text-[#A1A1AA] max-w-sm font-light leading-relaxed">
                Parco giochi custodito per bambini con animatori, organizzazione feste private, compleanni e serate di gala esclusive.
              </p>
              <div className="pt-2">
                <Link to="/eventi-privati" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-luxurious text-[#D4AF37] hover:text-white transition">
                  Scopri i Pacchetti <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Exclusive Registry Contact Card */}
          <div className="group relative h-96 overflow-hidden border border-[#27272A] rounded-sm bg-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37]">
                <Calendar size={18} />
              </div>
              <h2 className="text-2xl font-display text-white">Contatti & Orari</h2>
              <p className="text-xs text-[#A1A1AA] max-w-sm font-light leading-relaxed">
                Desideri prenotare o ricevere informazioni personalizzate? Trova i nostri contatti, indirizzo ed orari di apertura del club.
              </p>
              <div className="pt-2">
                <Link to="/contatti" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-luxurious text-[#D4AF37] hover:text-white transition">
                  Visualizza Contatti <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

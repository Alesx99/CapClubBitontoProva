import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SportPage() {
  const sports = [
    {
      name: 'Campi da Padel',
      bg: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600',
      badge: 'PANORAMICO',
      desc: 'Campi panoramici di ultima generazione con vetrate strutturali e manto sintetico testato WPT per rimbalzi perfetti.',
      bullets: ['✦ Spogliatoi VIP & docce calde', '✦ Asciugamani di spugna inclusi', '✦ Noleggio racchette pro'],
      bookingType: 'Campo Padel'
    },
    {
      name: 'Beach Volley',
      bg: 'https://images.unsplash.com/photo-1533854775446-65c4a3f5d8fe?auto=format&fit=crop&q=80&w=600',
      badge: 'SABBIA RISCALDATA',
      desc: "Gioca tutto l'anno sulla nostra sabbia finissima riscaldata e filtrata costantemente, in un ambiente coperto d'inverno.",
      bullets: ['✦ Sabbia bianca anti-trauma', '✦ Illuminazione notturna a LED pro', '✦ Area bar relax a bordo campo'],
      bookingType: 'Beach Volley'
    },
    {
      name: 'Calcio a 5 / 8',
      bg: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
      badge: 'ERBA SINTETICA PRO',
      desc: 'Sfide veloci e professionali su campi rivestiti in erba sintetica di ultima generazione omologata LND ad alto assorbimento.',
      bullets: ['✦ Pallone e pettorine fornite', '✦ Docce e spogliatoi VIP dedicati', '✦ Terzo tempo riservato al bistrot'],
      bookingType: 'Calcio'
    },
    {
      name: 'Palestra & Area Fitness',
      bg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
      badge: 'TECHNOGYM AREA',
      desc: 'Spazio fitness riservato dotato di macchine cardio/isotoniche Technogym di ultima generazione con bio-feedback integrato.',
      bullets: ['✦ Personal training su richiesta', '✦ Programmi metabolici personalizzati', '✦ Wellness water & integratori bar'],
      bookingType: 'Tavolo Bistrot' // Gym requests default to generic bistrot table query for scheduling info
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
              Benessere & Competizione
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-light text-white">
              Sport Arena
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-light tracking-luxurious">
              Campi d'eccellenza, attrezzature high-tech e spogliatoi VIP per un'esperienza atletica senza compromessi.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map(sport => (
              <div 
                key={sport.name}
                className="bg-[#121214] border border-[#27272A]/80 hover:border-[#D4AF37]/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div 
                    className="h-48 relative bg-cover bg-center"
                    style={{ backgroundImage: `url(${sport.bg})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-[#D4AF37]/20 border border-[#D4AF37]/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                      {sport.badge}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-display text-xl text-[#E4E4E7]">{sport.name}</h3>
                    <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
                      {sport.desc}
                    </p>
                    <ul className="text-[11px] text-[#D4AF37]/90 space-y-1 pt-1 font-light">
                      {sport.bullets.map(b => <li key={b}>{b}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link 
                    to="/prenota"
                    state={{ type: sport.bookingType }}
                    className="w-full block py-3 text-center bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition-all duration-300 rounded-sm"
                  >
                    Prenota
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

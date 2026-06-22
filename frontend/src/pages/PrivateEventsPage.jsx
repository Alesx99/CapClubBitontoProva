import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, Smile, ShieldAlert } from 'lucide-react';

export default function PrivateEventsPage() {
  const packages = [
    {
      name: 'Silver Club',
      badge: 'STANDARD',
      desc: 'Ideale per compleanni informali ma raffinati.',
      bullets: [
        '✦ Accesso al playground custodito (2 ore)',
        '✦ Animatore dedicato per giochi di gruppo',
        '✦ Buffet salato e analcolici per bambini',
        '✦ Torta artigianale personalizzata'
      ],
      presetNotes: 'Pacchetto Compleanno Richiesto: SILVER CLUB'
    },
    {
      name: 'Gold Club',
      badge: 'POPULAR',
      desc: 'La scelta preferita per feste dinamiche ed esclusive.',
      bullets: [
        '✦ Accesso al playground & gonfiabili (3 ore)',
        '✦ 2 Animatori dedicati con truccabimbi e palloncini',
        '✦ Buffet vip salato/dolce e bevande illimitate',
        '✦ Allestimento a tema personalizzato',
        '✦ Regalino di fine festa per gli ospiti'
      ],
      presetNotes: 'Pacchetto Compleanno Richiesto: GOLD CLUB',
      popular: true
    },
    {
      name: 'Platinum Club',
      badge: 'VIP EXPERIENCE',
      desc: 'Un evento memorabile curato nei minimi dettagli per stupire grandi e piccoli.',
      bullets: [
        '✦ Accesso completo al parco giochi in esclusiva',
        '✦ Team di animazione completo con spettacolo di magia/bolle',
        '✦ Catering gourmet per bambini e angolo aperitivo genitori',
        '✦ Allestimento scenografico premium con arco di palloncini',
        '✦ Servizio fotografico professionale dell\'evento',
        '✦ Torta monumentale personalizzata dello Chef'
      ],
      presetNotes: 'Pacchetto Compleanno Richiesto: PLATINUM CLUB'
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
              Celebrazioni Esclusive
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-light text-white">
              Kids & Eventi Privati
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-light tracking-luxurious">
              Celebra i compleanni dei tuoi bambini o organizza feste private all'interno di spazi verdi custoditi e attrezzati, guidati da personale qualificato.
            </p>
          </div>

          {/* Double content layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-white">Area Playground & Gonfiabili</h2>
              <p className="text-sm text-[#A1A1AA] font-light leading-relaxed">
                Il CapClub dispone di un'ampia zona parco dedicata ai più piccoli, con playground moderni e gonfiabili professionali certificati. L'area è interamente recintata e monitorata per consentire ai genitori di rilassarsi al Bistrot in tutta serenità.
              </p>
              <p className="text-sm text-[#A1A1AA] font-light leading-relaxed">
                I nostri animatori qualificati organizzano laboratori creativi, cacce al tesoro e attività sportive per stimolare la socializzazione e il divertimento sano all'aria aperta.
              </p>
            </div>
            
            <div className="h-80 overflow-hidden rounded-sm border border-[#27272A]">
              <img 
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800" 
                alt="Parco giochi bambini" 
                className="w-full h-full object-cover brightness-75"
              />
            </div>
          </div>

          {/* Package details */}
          <div className="space-y-8 pt-8">
            <h2 className="text-2xl font-display text-white text-center">Pacchetti Feste Compleanno</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map(pkg => (
                <div 
                  key={pkg.name}
                  className={`bg-[#121214] border p-8 rounded-sm flex flex-col justify-between space-y-6 transition duration-300 relative ${
                    pkg.popular 
                      ? 'border-[#D4AF37] shadow-xl shadow-[#D4AF37]/5' 
                      : 'border-[#27272A] hover:border-[#D4AF37]/40'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-[8px] text-[#0B0B0C] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      CONSIGLIATO
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-bold text-[#D4AF37] tracking-wider uppercase block">{pkg.badge}</span>
                      <h3 className="text-xl font-display text-white mt-1">{pkg.name}</h3>
                    </div>
                    <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
                      {pkg.desc}
                    </p>
                    <ul className="text-xs text-[#A1A1AA]/85 space-y-2 pt-2 font-light">
                      {pkg.bullets.map(b => <li key={b}>{b}</li>)}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#27272A]/80">
                    <Link 
                      to="/prenota"
                      state={{ type: 'Festa Bambini', notes: pkg.presetNotes }}
                      className={`w-full block py-3 text-center text-[10px] font-semibold uppercase tracking-luxurious transition duration-300 rounded-sm ${
                        pkg.popular 
                          ? 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C]' 
                          : 'border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5'
                      }`}
                    >
                      Richiedi Preventivo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

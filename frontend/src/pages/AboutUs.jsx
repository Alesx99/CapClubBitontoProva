import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
              La Nostra Storia
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-light text-white">
              Chi Siamo
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
          </div>

          {/* Hero editorial image */}
          <div className="relative h-[400px] overflow-hidden rounded-sm border border-[#27272A]">
            <img 
              src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1200" 
              alt="Club House" 
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-transparent"></div>
          </div>

          {/* Editorial Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm leading-relaxed text-[#A1A1AA] font-light">
            
            <div className="md:col-span-4 space-y-4 md:border-r border-[#27272A] md:pr-6">
              <h3 className="font-display text-lg text-white font-medium">
                La Filosofia
              </h3>
              <p>
                CapClub nasce dall'idea di fondere sport, socialità e alta gastronomia all'interno di un'unica cornice esclusiva ed elegante.
              </p>
              <p className="text-[#D4AF37] font-semibold">
                Un rifugio urbano dove la qualità del servizio e il comfort degli ospiti sono al centro di ogni dettaglio.
              </p>
            </div>

            <div className="md:col-span-8 space-y-6">
              <p>
                Fondato nel cuore pulsante del panorama sportivo e ricreativo, CapClub - Café & Bistrot si propone come un circolo privato e d'élite. La struttura offre impianti sportivi all'avanguardia ideati per atleti esigenti, affiancati da spazi relax e una cucina d'autore in grado di soddisfare i palati più raffinati.
              </p>
              
              <h3 className="font-display text-lg text-white font-medium pt-2">
                Un'Esperienza Unica
              </h3>
              
              <p>
                Dall'attenzione minuziosa riservata all'assegnazione dei tavoli del Bistrot, alla cura costante dei campi da gioco della nostra Sport Arena, fino alla pianificazione dettagliata di serate di gala o compleanni privati: al CapClub ogni momento è concepito per regalare un'esperienza indimenticabile e su misura.
              </p>
              
              <p>
                Il club accoglie soci e ospiti esterni su prenotazione, garantendo la massima riservatezza ed un'atmosfera serena e accogliente per tutta la famiglia.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

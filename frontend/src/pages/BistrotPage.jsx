import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronRight, ArrowRight, Utensils, Wine } from 'lucide-react';

export default function BistrotPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
              L'Esperienza Gastronomica
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-light text-white">
              The Bistrot
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
          </div>

          {/* Double editorial image layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 overflow-hidden rounded-sm border border-[#27272A]">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
                alt="Bistrot food" 
                className="w-full h-full object-cover brightness-75 hover:scale-105 transition duration-700"
              />
            </div>
            <div className="h-80 overflow-hidden rounded-sm border border-[#27272A]">
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" 
                alt="Cocktail cellar" 
                className="w-full h-full object-cover brightness-75 hover:scale-105 transition duration-700"
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm leading-relaxed text-[#A1A1AA] font-light">
            <div className="md:col-span-8 space-y-6">
              <p>
                Al CapClub Bistrot, l'arte culinaria si fonde con l'esclusività in un ambiente intimo ed elegante. Il nostro menù è un viaggio gourmet guidato dalla ricerca instancabile delle migliori materie prime locali, abbinate a tagli pregiati d'importazione.
              </p>
              
              <div className="border-l-2 border-[#D4AF37] pl-4 italic text-white font-serif">
                "La nostra missione è creare piatti indimenticabili capaci di unire la tradizione mediterranea con tecniche d'avanguardia."
              </div>

              <p>
                La cantina privata offre una selezione d'eccellenza, dai migliori spumanti e Champagne brut ai rossi e bianchi riserva del territorio nazionale, abbinati sapientemente ad ogni portata o gustati in relax durante il tramonto a bordo piscina.
              </p>
            </div>

            <div className="md:col-span-4 bg-[#121214] border border-[#27272A] p-6 rounded-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-display text-base text-white flex items-center gap-2">
                  <Wine size={16} className="text-[#D4AF37]" /> Dettagli Bistrot
                </h3>
                <ul className="text-xs space-y-2 text-[#A1A1AA]/80 font-mono">
                  <li>Pranzo: 12:30 - 15:00</li>
                  <li>Aperitivo: 18:00 - 20:00</li>
                  <li>Cena: 20:30 - 23:30</li>
                  <li>Dress Code: Elegante / Smart Casual</li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#27272A]">
                <Link 
                  to="/menu" 
                  className="w-full block py-2.5 text-center bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition rounded-sm"
                >
                  Consulta il Menù
                </Link>
                <Link 
                  to="/prenota" 
                  className="w-full block py-2.5 text-center border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 font-semibold text-[10px] uppercase tracking-luxurious transition rounded-sm"
                >
                  Prenota un Tavolo
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

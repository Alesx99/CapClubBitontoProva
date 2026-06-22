import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0C] border-t border-[#27272A] py-16 text-center text-xs text-[#A1A1AA] font-light space-y-6 relative z-10">
      <div className="flex flex-col items-center">
        <Link to="/" className="font-display text-xl font-bold tracking-widest text-[#D4AF37] mb-1">CAPCLUB</Link>
        <span className="text-[8px] uppercase tracking-luxurious text-[#A1A1AA]">Café, Sport & Private Club</span>
      </div>
      <p className="max-w-md mx-auto px-6 text-[#A1A1AA]/70 leading-relaxed font-sans">
        Centro sportivo Bellavista, Via Nicola Piacente, 16 - Bitonto (BA) | Telefono: +39 392 139 7663 | info@capclub.it
      </p>
      
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-3 uppercase tracking-luxurious text-[9px] font-semibold pt-4">
        <Link to="/" className="hover:text-[#D4AF37] transition">Home</Link>
        <Link to="/chi-siamo" className="hover:text-[#D4AF37] transition">Chi Siamo</Link>
        <Link to="/bistrot" className="hover:text-[#D4AF37] transition">Bistrot</Link>
        <Link to="/sport" className="hover:text-[#D4AF37] transition">Sport</Link>
        <Link to="/eventi-privati" className="hover:text-[#D4AF37] transition">Eventi</Link>
        <Link to="/contatti" className="hover:text-[#D4AF37] transition">Contatti</Link>
        <a href="https://www.instagram.com/capclub_bitonto/" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition">Instagram</a>
        <Link to="/admin" className="hover:text-[#D4AF37] transition text-gray-500 hover:text-white">Riservato</Link>
      </div>

      <p className="text-[10px] text-[#A1A1AA]/40 pt-8 font-sans">
        &copy; {new Date().getFullYear()} CapClub. Tutti i diritti riservati. Design Raffinato & Premium.
      </p>
    </footer>
  );
}

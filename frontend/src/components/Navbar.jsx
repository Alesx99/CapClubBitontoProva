import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Il Bistrot', path: '/bistrot' },
    { name: 'Menù', path: '/menu' },
    { name: 'Sport Arena', path: '/sport' },
    { name: 'Kids & Eventi', path: '/eventi-privati' },
    { name: 'Contatti', path: '/contatti' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0B0B0C]/85 backdrop-blur-md border-b border-[#27272A]/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col select-none">
          <span className="font-display text-2xl font-bold tracking-widest text-[#D4AF37]">CAPCLUB</span>
          <span className="text-[9px] font-sans tracking-[0.25em] text-[#A1A1AA] uppercase -mt-1">Café, Sport & Private</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-semibold uppercase tracking-luxurious text-[#A1A1AA]">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`hover:text-[#D4AF37] transition duration-300 py-2 border-b-2 ${
                isActive(link.path) ? 'border-[#D4AF37] text-white' : 'border-transparent'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/prenota" 
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] border border-transparent hover:border-[#D4AF37] hover:bg-transparent hover:text-[#D4AF37] transition duration-300 font-bold tracking-luxurious rounded-sm"
          >
            Prenota
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#E4E4E7] hover:text-[#D4AF37] transition"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#121214] border-b border-[#27272A] p-6 flex flex-col space-y-4 text-center font-semibold text-xs tracking-luxurious uppercase text-[#A1A1AA]">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 hover:text-[#D4AF37] transition ${
                isActive(link.path) ? 'text-white font-bold' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/prenota" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-3 bg-[#D4AF37] text-[#0B0B0C] rounded-sm transition"
          >
            Prenota un tavolo / campo
          </Link>
        </div>
      )}
    </header>
  );
}

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Clock, MessageSquare, User, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
              Mettiti in contatto
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-light text-white">
              Contatti
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Info details columns */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <h3 className="font-display text-xl text-white">CapClub Headquarters</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed font-light">
                  Siamo a tua completa disposizione per informazioni sulle quote associative, prenotazioni di eventi privati, disponibilità dei campi sportivi o prenotazione tavoli al bistrot.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <span className="p-2 border border-[#27272A] bg-[#121214] rounded-sm text-[#D4AF37]">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider text-[9px] mb-1">Indirizzo</h4>
                    <p className="text-[#A1A1AA] font-light">Centro sportivo Bellavista, Via Nicola Piacente, 16 - 70032 Bitonto (BA)</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span className="p-2 border border-[#27272A] bg-[#121214] rounded-sm text-[#D4AF37]">
                    <Phone size={16} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider text-[9px] mb-1">Telefono</h4>
                    <p className="text-[#A1A1AA] font-light">+39 392 139 7663</p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <span className="p-2 border border-[#27272A] bg-[#121214] rounded-sm text-[#D4AF37]">
                    <svg className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </span>
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider text-[9px] mb-1">Instagram</h4>
                    <a href="https://www.instagram.com/capclub_bitonto/" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-light">@capclub_bitonto</a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <span className="p-2 border border-[#27272A] bg-[#121214] rounded-sm text-[#D4AF37]">
                    <Mail size={16} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider text-[9px] mb-1">Email</h4>
                    <p className="text-[#A1A1AA] font-light">info@capclub.it</p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-4">
                  <span className="p-2 border border-[#27272A] bg-[#121214] rounded-sm text-[#D4AF37]">
                    <Clock size={16} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider text-[9px] mb-1">Orari Apertura</h4>
                    <p className="text-[#A1A1AA] font-light leading-relaxed">
                      Lunedì - Domenica: 08:00 - 24:00 <br />
                      *Bistrot: 12:30-15:00 / 18:00-23:30
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* General Inquiry form */}
            <div className="lg:col-span-7">
              <div className="bg-[#121214] border border-[#27272A] p-8 md:p-10 rounded-sm shadow-xl">
                
                <h3 className="font-display text-lg text-white mb-6">Invia un messaggio</h3>
                
                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37]">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-white text-base">Messaggio Ricevuto</h4>
                    <p className="text-xs text-[#A1A1AA] font-light max-w-sm mx-auto">
                      Grazie per averci contattato. La segreteria del club ti risponderà all'indirizzo email fornito il prima possibile.
                    </p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="mt-4 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] text-[10px] uppercase font-semibold tracking-wider transition rounded-sm"
                    >
                      Nuovo Messaggio
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">Il Tuo Nome</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                            <User size={12} />
                          </span>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="E.g. Alessio"
                            className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white pl-9 pr-4 py-2.5 rounded-sm outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">Indirizzo Email</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A1A1AA]/50">
                            <Mail size={12} />
                          </span>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="E.g. alessio@example.com"
                            className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white pl-9 pr-4 py-2.5 rounded-sm outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">Messaggio</label>
                      <div className="relative">
                        <span className="absolute top-2.5 left-3 text-[#A1A1AA]/50">
                          <MessageSquare size={12} />
                        </span>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          placeholder="Scrivi qui la tua richiesta..."
                          className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white pl-9 pr-4 py-2.5 rounded-sm outline-none transition resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#C5A059] disabled:bg-[#D4AF37]/50 text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition rounded-sm flex items-center justify-center gap-1.5"
                    >
                      {loading ? <Loader2 size={12} className="animate-spin text-[#0B0B0C]" /> : 'Invia Messaggio'}
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

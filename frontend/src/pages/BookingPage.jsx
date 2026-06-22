import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Loader2, Calendar, Clock, User, Mail, Phone, MessageSquare, Shield, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { api } from '../api/client';

export default function BookingPage() {
  const location = useLocation();
  
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

  // Sync state values passed from other pages (Bistrot, Sport, Events)
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        type: location.state.type || prev.type,
        notes: location.state.notes || prev.notes
      }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setError(err.message || 'Si è verificato un errore durante l\'invio. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.02)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <span className="text-[11px] font-semibold tracking-luxurious text-[#D4AF37] uppercase block">
              Riserva la tua esperienza
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-light text-white">
              Club Booking
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
            <p className="text-xs text-[#A1A1AA] font-light max-w-md mx-auto leading-relaxed">
              Invia una richiesta di prenotazione. Ogni richiesta viene valutata singolarmente per garantire un servizio impeccabile ed esclusivo.
            </p>
          </div>

          {/* Form container */}
          <div className="bg-[#121214] border border-[#27272A] p-8 md:p-12 rounded-sm shadow-2xl">
            {success ? (
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] mb-2 animate-scale-up">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-display text-white">Richiesta Inviata</h2>
                <p className="text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed font-light">
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
                  <div className="p-4 bg-red-955/20 border border-red-500/30 text-red-400 text-xs rounded-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
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
                        className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
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
                        className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-1.5">
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
                        className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5">
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
                        className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] pl-10 pr-10 py-3 rounded-sm outline-none appearance-none transition"
                      >
                        <option value="Tavolo Bistrot">Tavolo Bistrot</option>
                        <option value="Campo Padel">Campo Padel</option>
                        <option value="Beach Volley">Campo Beach Volley</option>
                        <option value="Calcio">Campo da Calcio</option>
                        <option value="Festa Bambini">Festa Bambini / Evento Privato</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A1A1AA]/50 pointer-events-none">
                        <ChevronRight size={14} className="rotate-90" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-1.5">
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
                        className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
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
                        className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
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
                      placeholder="Fornisci dettagli sul numero di partecipanti, intolleranze alimentari, preferenze tavoli, o pacchetti compleanno scelti..."
                      className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] pl-10 pr-4 py-3 rounded-sm outline-none transition resize-none"
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
                        Elaborazione Richiesta...
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
      </main>

      <Footer />
    </div>
  );
}

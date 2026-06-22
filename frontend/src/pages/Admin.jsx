import React, { useState, useEffect } from 'react';
import { api, isAdminLogged } from '../api/client';
import LoginForm from '../components/LoginForm';
import MenuManager from '../components/MenuManager';
import StyleEditor from '../components/StyleEditor';
import TableMap from '../components/TableMap';
import { 
  Sparkles, ClipboardList, Check, X, Calendar, User, 
  Mail, Phone, MessageSquare, Clock, ArrowRight, LogOut, FileText, QrCode, Layout, Loader2 
} from 'lucide-react';
import { useMenu } from '../hooks/useMenu';
import QRCode from 'qrcode';

// Tab 1: Menu Manager Wrapper (loads normal menu, renders MenuManager)
function MenuManagerWrapper({ password, onSettingsChanged }) {
  const { menu, settings, loading, error, reload } = useMenu(false, false); // onlyAvailable=false, isEvent=false

  if (loading) return <div className="py-12 text-center text-xs text-club-muted">Caricamento menù...</div>;
  if (error) return <div className="py-12 text-center text-xs text-red-400">{error}</div>;

  return (
    <MenuManager 
      menu={menu} 
      settings={settings} 
      onChanged={reload} 
      isEvent={false} 
    />
  );
}

// Tab 2: Style Editor Wrapper (loads settings, renders StyleEditor)
function StyleEditorWrapper({ password }) {
  return <StyleEditor password={password} />;
}

// Tab 3: Event Manager Page Wrapper (loads event menu and renders Event Manager Page)
function EventManagerWrapper() {
  const { menu, settings, loading, error, reload } = useMenu(false, true); // onlyAvailable=false, isEvent=true
  const [eventName, setEventName] = useState('');
  const [eventSubtitle, setEventSubtitle] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (settings) {
      setEventName(settings.event_name || '');
      setEventSubtitle(settings.event_subtitle || '');
    }
  }, [settings]);

  useEffect(() => {
    // Generate QR Code for /#/eventi
    const host = window.location.origin + window.location.pathname;
    const url = `${host}#/eventi`;
    QRCode.toDataURL(url, { width: 200, margin: 2 })
      .then(data => setQrUrl(data))
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="py-12 text-center text-xs text-club-muted">Caricamento impostazioni evento...</div>;
  if (error) return <div className="py-12 text-center text-xs text-red-400">{error}</div>;

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.updateSettings({
        event_name: eventName,
        event_subtitle: eventSubtitle
      });
      alert('Impostazioni dell\'evento aggiornate con successo.');
      reload();
    } catch (err) {
      alert(`Errore nell'aggiornamento: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Event Details Form */}
      <div className="bg-[#121214] border border-[#27272A] p-6 rounded-sm">
        <h2 className="text-lg font-display text-white mb-6 flex items-center gap-2">
          <Sparkles size={18} className="text-[#D4AF37]" /> Dettagli Evento Speciale
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleSaveSettings} className="space-y-4 md:col-span-8">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Nome dell'Evento
              </label>
              <input 
                type="text" 
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                placeholder="E.g. Gran Galà di Capodanno"
                className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] px-4 py-3 rounded-sm outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Sottotitolo / Descrizione Evento
              </label>
              <input 
                type="text" 
                value={eventSubtitle}
                onChange={e => setEventSubtitle(e.target.value)}
                placeholder="E.g. Menu degustazione esclusivo e musica dal vivo"
                className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-[#E4E4E7] px-4 py-3 rounded-sm outline-none transition"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={savingSettings}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A059] disabled:bg-[#D4AF37]/50 text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition rounded-sm flex items-center gap-2"
              >
                {savingSettings ? <Loader2 size={14} className="animate-spin" /> : 'Salva Impostazioni'}
              </button>
            </div>
          </form>

          {/* QR Code and links */}
          <div className="md:col-span-4 flex flex-col items-center p-4 border border-[#27272A] bg-[#0B0B0C] rounded-sm text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-4">
              QR Code Menù Evento
            </span>
            {qrUrl ? (
              <img src={qrUrl} alt="Event Menu QR" className="w-40 h-40 border border-[#27272A] p-2 bg-white rounded-sm" />
            ) : (
              <div className="w-40 h-40 bg-[#121214] flex items-center justify-center text-xs text-club-muted">Generating...</div>
            )}
            <div className="mt-4 w-full space-y-2">
              <a 
                href={qrUrl} 
                download={`qr-event-${eventName.toLowerCase().replace(/\s+/g, '-')}.png`}
                className="block text-center py-2 bg-[#121214] hover:bg-[#27272A] text-white text-[10px] uppercase font-semibold tracking-wider rounded-sm border border-[#27272A] transition"
              >
                Scarica QR
              </a>
              <a 
                href="#/print-event" 
                target="_blank"
                className="block text-center py-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase font-semibold tracking-wider rounded-sm transition"
              >
                Anteprima Stampa A4
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Event Menu Items Manager */}
      <div className="border-t border-[#27272A]/50 pt-8">
        <h3 className="text-lg font-display text-white mb-6">
          Piatti Speciali del Menù Evento
        </h3>
        <MenuManager 
          menu={menu} 
          settings={settings} 
          onChanged={reload} 
          isEvent={true} 
        />
      </div>
    </div>
  );
}

// Tab 4: Bookings Manager Panel (NEW)
function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [subTab, setSubTab] = useState('mappa'); // 'mappa' | 'registro'

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Errore nel caricamento delle prenotazioni.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setActionId(id);
    try {
      await api.updateBookingStatus(id, status);
      // Update local state list
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert(`Impossibile aggiornare lo stato: ${err.message}`);
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <div className="py-12 text-center text-xs text-club-muted">Caricamento prenotazioni...</div>;
  if (error) return <div className="py-12 text-center text-xs text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#27272A] pb-4 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-display text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-[#D4AF37]" /> Prenotazioni
          </h2>
          <div className="flex bg-[#0B0B0C] p-1 border border-[#27272A] rounded-sm">
            <button
              onClick={() => setSubTab('mappa')}
              className={`px-3 py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-sm transition duration-200 ${
                subTab === 'mappa' 
                  ? 'bg-[#D4AF37] text-[#0B0B0C]' 
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Mappa Tavoli
            </button>
            <button
              onClick={() => setSubTab('registro')}
              className={`px-3 py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-sm transition duration-200 ${
                subTab === 'registro' 
                  ? 'bg-[#D4AF37] text-[#0B0B0C]' 
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Registro Lista
            </button>
          </div>
        </div>
        <button 
          onClick={fetchBookings} 
          className="px-4 py-2 border border-[#27272A] hover:border-[#D4AF37]/50 hover:bg-[#121214] text-[10px] uppercase font-semibold tracking-wider text-[#A1A1AA] hover:text-white transition rounded-sm"
        >
          Aggiorna Lista
        </button>
      </div>

      {subTab === 'mappa' ? (
        <TableMap bookings={bookings} onBookingsChanged={fetchBookings} />
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#27272A] bg-[#121214]/50 rounded-sm">
          <p className="text-sm font-light text-[#A1A1AA]">Nessuna richiesta di prenotazione presente nel registro.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#27272A] rounded-sm bg-[#121214]/35">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#121214]/90 text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">
                <th className="p-4">Cliente</th>
                <th className="p-4">Tipologia</th>
                <th className="p-4">Data & Ora</th>
                <th className="p-4">Dettagli / Note</th>
                <th className="p-4 text-center">Stato</th>
                <th className="p-4 text-right">Azioni Rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {bookings.map(booking => {
                const isPending = booking.status === 'pending';
                const isConfirmed = booking.status === 'confirmed';
                const isDeclined = booking.status === 'declined';
                
                return (
                  <tr key={booking.id} className="hover:bg-[#121214]/50 transition duration-150">
                    {/* Guest details */}
                    <td className="p-4">
                      <div className="font-semibold text-[#E4E4E7]">{booking.name}</div>
                      <div className="text-[10px] text-[#A1A1AA] flex flex-col gap-0.5 mt-0.5">
                        <span className="flex items-center gap-1"><Mail size={10} /> {booking.email}</span>
                        <span className="flex items-center gap-1"><Phone size={10} /> {booking.phone}</span>
                      </div>
                    </td>
                    
                    {/* Booking Type */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm ${
                        booking.type === 'Tavolo Bistrot' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/20' :
                        booking.type === 'Campo Padel' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/20' :
                        booking.type === 'Festa Bambini' ? 'bg-purple-950/20 text-purple-400 border border-purple-500/20' :
                        'bg-amber-950/20 text-amber-400 border border-amber-500/20'
                      }`}>
                        {booking.type}
                      </span>
                    </td>
                    
                    {/* Date and Time */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[#E4E4E7]">
                        <Calendar size={12} className="text-[#D4AF37]/80" /> {booking.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#A1A1AA] mt-1 text-[10px]">
                        <Clock size={12} /> {booking.time}
                      </div>
                    </td>
                    
                    {/* Special Notes */}
                    <td className="p-4 max-w-xs">
                      {booking.notes ? (
                        <p className="text-[11px] text-[#A1A1AA] italic leading-relaxed whitespace-pre-line">
                          {booking.notes}
                        </p>
                      ) : (
                        <span className="text-[10px] text-[#A1A1AA]/40 italic">Nessuna nota speciale</span>
                      )}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                        isPending ? 'bg-amber-900/20 text-amber-400 border border-amber-500/30' :
                        isConfirmed ? 'bg-green-900/20 text-green-400 border border-green-500/30' :
                        'bg-red-900/20 text-red-400 border border-red-500/30'
                      }`}>
                        {booking.status === 'pending' ? 'in attesa' : booking.status === 'confirmed' ? 'confermata' : 'rifiutata'}
                      </span>
                    </td>
                    
                    {/* Action buttons */}
                    <td className="p-4 text-right whitespace-nowrap">
                      {isPending ? (
                        <div className="inline-flex gap-2">
                          <button
                            disabled={actionId !== null}
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            className="p-1.5 bg-green-950/40 hover:bg-green-600 border border-green-500/35 hover:border-green-500 text-green-400 hover:text-[#0B0B0C] transition duration-200 rounded-sm"
                            title="Conferma prenotazione"
                          >
                            {actionId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          </button>
                          <button
                            disabled={actionId !== null}
                            onClick={() => handleUpdateStatus(booking.id, 'declined')}
                            className="p-1.5 bg-red-950/40 hover:bg-red-600 border border-red-500/35 hover:border-red-500 text-red-400 hover:text-white transition duration-200 rounded-sm"
                            title="Rifiuta prenotazione"
                          >
                            {actionId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-club-muted font-light">
                          Aggiornato il {new Date(booking.updated_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [logged, setLogged] = useState(isAdminLogged());
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'stile', 'eventi', 'prenotazioni'

  const handleLoginSuccess = () => {
    setLogged(true);
  };

  const handleLogout = () => {
    api.logout();
    setLogged(false);
  };

  if (!logged) {
    return <LoginForm onLogin={handleLoginSuccess} />;
  }

  const pwd = api.login; // Placeholder: client loads key from localstorage

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] font-sans selection:bg-[#D4AF37] selection:text-[#0B0B0C] flex flex-col">
      
      {/* Admin Panel Header */}
      <header className="border-b border-[#27272A] bg-[#121214]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-widest text-[#D4AF37]">CAPCLUB</span>
            <span className="text-[8px] tracking-[0.25em] text-[#A1A1AA] uppercase -mt-0.5">Control Panel Area</span>
          </div>

          {/* Quick links and Logout */}
          <div className="flex items-center space-x-4 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            <a href="#/admin/qr" className="flex items-center gap-1 hover:text-white py-2 px-3 border border-[#27272A] rounded-sm transition">
              <QrCode size={12} /> QR Tavoli
            </a>
            <a href="#/menu" className="flex items-center gap-1 hover:text-white py-2 px-3 border border-[#27272A] rounded-sm transition">
              <Layout size={12} /> Vedi Pubblico
            </a>
            <a href="#/print" className="flex items-center gap-1 hover:text-white py-2 px-3 border border-[#27272A] rounded-sm transition">
              <FileText size={12} /> Stampa PDF
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-red-400 py-2 px-3 border border-red-950/20 bg-red-950/5 hover:bg-red-950/15 rounded-sm transition"
            >
              <LogOut size={12} /> Esci
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigators */}
      <div className="border-b border-[#27272A]/50 bg-[#121214]/50">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`py-4 text-xs font-semibold uppercase tracking-luxurious border-b-2 transition duration-300 ${
              activeTab === 'menu' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Gestione Menù
          </button>
          
          <button 
            onClick={() => setActiveTab('stile')}
            className={`py-4 text-xs font-semibold uppercase tracking-luxurious border-b-2 transition duration-300 ${
              activeTab === 'stile' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Editor di Stile
          </button>
          
          <button 
            onClick={() => setActiveTab('eventi')}
            className={`py-4 text-xs font-semibold uppercase tracking-luxurious border-b-2 transition duration-300 ${
              activeTab === 'eventi' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Gestione Eventi
          </button>
          
          <button 
            onClick={() => setActiveTab('prenotazioni')}
            className={`py-4 text-xs font-semibold uppercase tracking-luxurious border-b-2 transition duration-300 relative ${
              activeTab === 'prenotazioni' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Prenotazioni
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="animate-fade-in">
          {activeTab === 'menu' && (
            <MenuManagerWrapper password={pwd} />
          )}
          {activeTab === 'stile' && (
            <StyleEditorWrapper password={pwd} />
          )}
          {activeTab === 'eventi' && (
            <EventManagerWrapper />
          )}
          {activeTab === 'prenotazioni' && (
            <BookingsManager />
          )}
        </div>
      </main>

    </div>
  );
}

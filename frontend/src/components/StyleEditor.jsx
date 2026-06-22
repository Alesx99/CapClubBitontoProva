import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Upload, Trash2, Sliders, Type, Palette, Printer, Info, Save, Mail, Image, Grid, Loader2 
} from 'lucide-react';

export default function StyleEditor() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);
  
  // Local states for inputs to avoid excessive api calls on slider dragging
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantSubtitle, setRestaurantSubtitle] = useState('');
  const [accentColor, setAccentColor] = useState('#D4AF37');
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const [bookingEmail, setBookingEmail] = useState('info@capclub.it');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
        // Sync local states
        setRestaurantName(data.restaurant_name || '');
        setRestaurantSubtitle(data.restaurant_subtitle || '');
        setAccentColor(data.accent_color || '#D4AF37');
        setCurrencySymbol(data.currency_symbol || '€');
        setBookingEmail(data.booking_email_receiver || 'info@capclub.it');
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleUpdateSetting = async (key, value) => {
    setSavingField(key);
    try {
      const patched = await api.updateSettings({ [key]: value });
      setSettings(patched);
    } catch (err) {
      alert(`Errore nell'aggiornamento impostazione: ${err.message}`);
    } finally {
      setSavingField(null);
    }
  };

  const handleFileUpload = async (kind, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSavingField(kind);
    try {
      const res = await api.uploadAsset(kind, file);
      // Update settings with filepath
      const keyMap = {
        logo: 'logo_path',
        background: 'background_path',
        watermark: 'watermark_path'
      };
      
      const updated = await api.updateSettings({ [keyMap[kind]]: res.filepath });
      setSettings(updated);
      alert('Immagine caricata con successo.');
    } catch (err) {
      alert(`Errore nel caricamento del file: ${err.message}`);
    } finally {
      setSavingField(null);
    }
  };

  const handleDeleteAsset = async (kind, filepath) => {
    if (!window.confirm('Vuoi rimuovere questa immagine?')) return;
    
    // Extract filename from path
    const parts = filepath.split('/');
    const filename = parts[parts.length - 1];
    
    setSavingField(kind);
    try {
      await api.deleteAsset(filename);
      const keyMap = {
        logo: 'logo_path',
        background: 'background_path',
        watermark: 'watermark_path'
      };
      const updated = await api.updateSettings({ [keyMap[kind]]: '' });
      setSettings(updated);
    } catch (err) {
      alert(`Errore nella cancellazione: ${err.message}`);
    } finally {
      setSavingField(null);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-club-muted">Caricamento configuratore di stile...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 font-sans">
      
      {/* 1. IDENTITÀ DEL LOCALE */}
      <section className="bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-6">
        <h2 className="text-base font-display text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Sliders size={16} className="text-[#D4AF37]" /> Identità del Club & Impostazioni
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Nome Locale</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={restaurantName}
                onChange={e => setRestaurantName(e.target.value)}
                onBlur={() => handleUpdateSetting('restaurant_name', restaurantName)}
                className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2.5 rounded-sm outline-none transition"
              />
              {savingField === 'restaurant_name' && <Loader2 size={14} className="animate-spin text-[#D4AF37] self-center" />}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Sottotitolo Locale</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={restaurantSubtitle}
                onChange={e => setRestaurantSubtitle(e.target.value)}
                onBlur={() => handleUpdateSetting('restaurant_subtitle', restaurantSubtitle)}
                className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2.5 rounded-sm outline-none transition"
              />
              {savingField === 'restaurant_subtitle' && <Loader2 size={14} className="animate-spin text-[#D4AF37] self-center" />}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Simbolo Valuta</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={currencySymbol}
                onChange={e => setCurrencySymbol(e.target.value)}
                onBlur={() => handleUpdateSetting('currency_symbol', currencySymbol)}
                className="w-20 bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2.5 rounded-sm outline-none transition text-center"
              />
              {savingField === 'currency_symbol' && <Loader2 size={14} className="animate-spin text-[#D4AF37] self-center" />}
            </div>
          </div>

          {/* Booking receiver email config */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1">
              <Mail size={12} className="text-[#D4AF37]" /> Ricevitore Notifiche Prenotazioni
            </label>
            <div className="flex gap-2">
              <input 
                type="email" 
                value={bookingEmail}
                onChange={e => setBookingEmail(e.target.value)}
                onBlur={() => handleUpdateSetting('booking_email_receiver', bookingEmail)}
                placeholder="info@capclub.it"
                className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2.5 rounded-sm outline-none transition"
              />
              {savingField === 'booking_email_receiver' && <Loader2 size={14} className="animate-spin text-[#D4AF37] self-center" />}
            </div>
            <p className="text-[9px] text-[#A1A1AA]/60">Le richieste di prenotazione verranno inviate e loggate a questo indirizzo.</p>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="p-4 border border-[#27272A] bg-[#0B0B0C] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-white">Logo del Club</span>
            <span className="block text-[10px] text-[#A1A1AA]">JPEG, PNG, WEBP, SVG (consigliato trasparente)</span>
          </div>

          {settings.logo_path ? (
            <div className="flex items-center gap-4">
              <img src={settings.logo_path} alt="Logo preview" className="h-16 max-w-[120px] object-contain border border-[#27272A] p-2 bg-[#121214]" />
              <button 
                onClick={() => handleDeleteAsset('logo', settings.logo_path)}
                className="p-2 border border-red-950 bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-[#0B0B0C] transition rounded-sm"
                title="Rimuovi Logo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer px-5 py-3 border border-dashed border-[#27272A] hover:border-[#D4AF37]/50 text-xs text-[#A1A1AA] hover:text-white rounded-sm transition flex items-center gap-2">
              <Upload size={14} /> Carica Logo
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload('logo', e)} />
            </label>
          )}
        </div>
      </section>

      {/* 2. CONFIGURAZIONE SFONDO PUBBLICO */}
      <section className="bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-6">
        <h2 className="text-base font-display text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Image size={16} className="text-[#D4AF37]" /> Sfondo del Menù Pubblico
        </h2>

        {/* Background Image Upload */}
        <div className="p-4 border border-[#27272A] bg-[#0B0B0C] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-white">Immagine Sfondo</span>
            <span className="block text-[10px] text-[#A1A1AA]">Sfondo per la pagina del menù pubblico (e.g. texture marmo o carta)</span>
          </div>

          {settings.background_path ? (
            <div className="flex items-center gap-4">
              <img src={settings.background_path} alt="Background preview" className="h-16 max-w-[120px] object-cover border border-[#27272A] p-1 bg-[#121214]" />
              <button 
                onClick={() => handleDeleteAsset('background', settings.background_path)}
                className="p-2 border border-red-950 bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-[#0B0B0C] transition rounded-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer px-5 py-3 border border-dashed border-[#27272A] hover:border-[#D4AF37]/50 text-xs text-[#A1A1AA] hover:text-white rounded-sm transition flex items-center gap-2">
              <Upload size={14} /> Carica Sfondo
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload('background', e)} />
            </label>
          )}
        </div>

        {/* Background Positioning Settings */}
        {settings.background_path && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {/* Background size */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Dimensione Sfondo</label>
              <select
                value={settings.background_size || 'cover'}
                onChange={e => handleUpdateSetting('background_size', e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#27272A] text-xs text-white px-3 py-2 rounded-sm outline-none"
              >
                <option value="cover">Adatta (Cover)</option>
                <option value="contain">Contieni (Contain)</option>
                <option value="auto">Originale (Auto)</option>
              </select>
            </div>

            {/* Background position */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Posizione</label>
              <select
                value={settings.background_position || 'center'}
                onChange={e => handleUpdateSetting('background_position', e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#27272A] text-xs text-white px-3 py-2 rounded-sm outline-none"
              >
                <option value="center">Centrato</option>
                <option value="top">In alto</option>
                <option value="bottom">In basso</option>
              </select>
            </div>

            {/* Background opacity */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                Opacità Sfondo: {settings.background_opacity || '0.3'}
              </label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={settings.background_opacity ?? 0.3}
                onChange={e => setSettings(prev => ({ ...prev, background_opacity: e.target.value }))}
                onMouseUp={e => handleUpdateSetting('background_opacity', e.target.value)}
                onTouchEnd={e => handleUpdateSetting('background_opacity', e.target.value)}
                className="w-full accent-[#D4AF37]"
              />
            </div>
          </div>
        )}
      </section>

      {/* 3. TAVOLOZZA COLORI & TIPOGRAFIA */}
      <section className="bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-6">
        <h2 className="text-base font-display text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Palette size={16} className="text-[#D4AF37]" /> Estetica & Palette Colori
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Accent Color picker */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Colore Accento UI (Gold/Champagne)</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
                onBlur={e => handleUpdateSetting('accent_color', e.target.value)}
                className="w-12 h-10 border border-[#27272A] bg-transparent rounded-sm cursor-pointer"
              />
              <input 
                type="text" 
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
                onBlur={e => handleUpdateSetting('accent_color', e.target.value)}
                className="w-28 bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none transition text-center font-mono"
              />
              {savingField === 'accent_color' && <Loader2 size={14} className="animate-spin text-[#D4AF37] self-center" />}
            </div>
          </div>

          {/* Font Titles */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Font Titoli</label>
            <select
              value={settings.font_title || 'Playfair Display'}
              onChange={e => handleUpdateSetting('font_title', e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#27272A] text-xs text-white px-3 py-2.5 rounded-sm outline-none transition"
            >
              <option value="Playfair Display">Playfair Display (Classico/Elegante)</option>
              <option value="Montserrat">Montserrat (Moderno/Pulito)</option>
              <option value="Georgia">Georgia (Serif Standard)</option>
              <option value="system-ui">Sans Serif di Sistema</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. IMPOSTAZIONI STAMPA A4 */}
      <section className="bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-6">
        <h2 className="text-base font-display text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Printer size={16} className="text-[#D4AF37]" /> Parametri di Stampa A4
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Margins */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Margine di Stampa (mm)</label>
            <input 
              type="number" 
              min="5" 
              max="50"
              value={settings.print_margin_mm || '15'}
              onChange={e => handleUpdateSetting('print_margin_mm', e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none text-center"
            />
          </div>

          {/* Font Size */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Dimensione Testo Base (pt)</label>
            <input 
              type="number" 
              min="7" 
              max="24"
              value={settings.print_font_size_pt || '11'}
              onChange={e => handleUpdateSetting('print_font_size_pt', e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none text-center"
            />
          </div>

          {/* Frame Style */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Cornice Decorativa</label>
            <select
              value={settings.print_frame_style || 'classic'}
              onChange={e => handleUpdateSetting('print_frame_style', e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#27272A] text-xs text-white px-3 py-2 rounded-sm outline-none"
            >
              <option value="classic">Classica Sottile</option>
              <option value="double">Doppio Bordo</option>
              <option value="ornate">Ornamentale Floreale</option>
              <option value="minimal_gold">Oro Minimale</option>
              <option value="vintage_menu">Vintage Retrò</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Frame Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="frame-enabled"
              checked={settings.print_frame_enabled === 'true'}
              onChange={e => handleUpdateSetting('print_frame_enabled', e.target.checked ? 'true' : 'false')}
              className="w-4 h-4 rounded-sm border-[#27272A] bg-[#0B0B0C] text-[#D4AF37] focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="frame-enabled" className="text-xs text-[#E4E4E7] cursor-pointer">
              Abilita cornice decorativa nei fogli stampati
            </label>
          </div>

          {/* Centered section titles */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="title-center"
              checked={settings.print_section_title_center === 'true'}
              onChange={e => handleUpdateSetting('print_section_title_center', e.target.checked ? 'true' : 'false')}
              className="w-4 h-4 rounded-sm border-[#27272A] bg-[#0B0B0C] text-[#D4AF37] focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="title-center" className="text-xs text-[#E4E4E7] cursor-pointer">
              Centra i titoli delle sezioni in stampa
            </label>
          </div>
        </div>
      </section>

    </div>
  );
}

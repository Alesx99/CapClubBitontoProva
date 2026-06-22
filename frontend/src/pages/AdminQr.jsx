import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { ArrowLeft, Printer, RefreshCw, Loader2, Save } from 'lucide-react';
import QRCode from 'qrcode';

export default function AdminQr() {
  const [startTable, setStartTable] = useState(1);
  const [endTable, setEndTable] = useState(20);
  const [qrSize, setQrSize] = useState(170);
  const [baseUrl, setBaseUrl] = useState('');
  const [qrCodes, setQrCodes] = useState([]);
  
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await api.getSettings();
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        const cleanPath = pathname.endsWith('/') ? pathname : pathname + '/';
        const defaultBase = settings.public_base_url || `${origin}${cleanPath}#/menu`;
        setBaseUrl(defaultBase);
      } catch (err) {
        console.error('Failed to load settings:', err);
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        const cleanPath = pathname.endsWith('/') ? pathname : pathname + '/';
        setBaseUrl(`${origin}${cleanPath}#/menu`);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  // Re-generate QR codes when range or base URL changes
  useEffect(() => {
    if (loadingSettings) return;
    
    async function generateQrs() {
      setGenerating(true);
      const codesList = [];
      const start = Math.min(startTable, endTable);
      const end = Math.max(startTable, endTable);
      
      for (let table = start; table <= end; table++) {
        // Compose URL: e.g. base_url?table=5
        const targetUrl = baseUrl.includes('?') 
          ? `${baseUrl}&table=${table}` 
          : `${baseUrl}?table=${table}`;
        
        try {
          const dataUrl = await QRCode.toDataURL(targetUrl, {
            width: qrSize,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          codesList.push({ table, url: targetUrl, dataUrl });
        } catch (err) {
          console.error(`Failed to generate QR for table ${table}:`, err);
        }
      }
      setQrCodes(codesList);
      setGenerating(false);
    }

    generateQrs();
  }, [startTable, endTable, qrSize, baseUrl, loadingSettings]);

  const handleSaveBaseUrl = async () => {
    setSavingSettings(true);
    try {
      await api.updateSettings({ public_base_url: baseUrl });
      alert('URL Base salvato nelle impostazioni di sistema.');
    } catch (err) {
      alert(`Errore nel salvataggio: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] font-sans relative selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      
      {/* Control panel - hidden during print */}
      <div className="no-print bg-[#121214] border-b border-[#27272A] py-6 px-6 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <a href="#/admin" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxurious text-[#A1A1AA] hover:text-[#D4AF37] transition">
              <ArrowLeft size={14} /> Torna all'Admin
            </a>
            <h1 className="text-xl font-display text-white">Generatore QR Code Tavoli</h1>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            
            {/* Start Table */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">Da Tavolo</label>
              <input 
                type="number" 
                min="1" 
                value={startTable} 
                onChange={e => setStartTable(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none text-center"
              />
            </div>

            {/* End Table */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">A Tavolo</label>
              <input 
                type="number" 
                min="1" 
                value={endTable} 
                onChange={e => setEndTable(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none text-center"
              />
            </div>

            {/* QR Size */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">Dim. Pixel</label>
              <input 
                type="number" 
                min="100" 
                max="400" 
                value={qrSize} 
                onChange={e => setQrSize(parseInt(e.target.value, 10) || 150)}
                className="w-20 bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none text-center"
              />
            </div>

            {/* URL Base */}
            <div className="space-y-1.5 min-w-[200px] flex-grow">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">URL Base Menù</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={baseUrl} 
                  onChange={e => setBaseUrl(e.target.value)}
                  placeholder="https://capclub.it/menu"
                  className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none"
                />
                <button 
                  onClick={handleSaveBaseUrl}
                  disabled={savingSettings || loadingSettings}
                  className="p-2 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] rounded-sm transition flex items-center justify-center"
                  title="Salva URL di default"
                >
                  {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                </button>
              </div>
            </div>

            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-[10px] uppercase tracking-luxurious transition rounded-sm flex items-center gap-1.5"
            >
              <Printer size={14} /> Stampa QR
            </button>
          </div>
        </div>
      </div>

      {/* QR Codes Grid for print/display */}
      <main className="max-w-7xl mx-auto p-8">
        {generating ? (
          <div className="flex flex-col items-center justify-center py-20 text-club-muted">
            <Loader2 className="animate-spin text-[#D4AF37] mb-2" size={32} />
            <p className="text-[10px] uppercase tracking-wider">Generazione codici in corso...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-3 print:gap-8">
            {qrCodes.map(({ table, url, dataUrl }) => (
              <div 
                key={table} 
                className="bg-[#121214] border border-[#27272A] p-6 text-center rounded-sm flex flex-col items-center justify-between shadow-lg print:border print:border-black print:bg-white print:text-black print:shadow-none print:break-inside-avoid print:page-break-inside-avoid"
              >
                <div>
                  <h2 className="font-display text-lg font-bold tracking-widest text-[#D4AF37] print:text-black">
                    CAPCLUB
                  </h2>
                  <p className="text-[7px] uppercase tracking-[0.25em] text-[#A1A1AA] print:text-gray-500 mb-4">
                    Café & Bistrot
                  </p>
                </div>
                
                <div className="my-4 p-2 bg-white rounded-sm border border-[#27272A]/50 print:border-none">
                  <img src={dataUrl} alt={`Table ${table} QR`} className="w-full object-contain" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-light tracking-wide text-white print:text-black">
                    Tavolo {table}
                  </h3>
                  <p className="text-[9px] text-[#A1A1AA] print:text-gray-600 font-light leading-relaxed max-w-[150px] mx-auto">
                    Scansiona il codice per ordinare direttamente dal tuo smartphone
                  </p>
                  <p className="text-[7px] text-[#A1A1AA]/50 print:text-gray-400 font-mono select-all truncate max-w-[170px] mx-auto pt-2">
                    {url}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}

import React, { useState } from 'react';
import { api } from '../api/client';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';

export default function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await api.login(password);
      onLogin(password);
    } catch (err) {
      setError(err.message || 'Password non corretta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E4E4E7] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      
      {/* Back to website link */}
      <a href="#/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxurious text-[#A1A1AA] hover:text-[#D4AF37] transition">
        <ArrowLeft size={14} /> Back to Web Site
      </a>

      <div className="w-full max-w-sm bg-[#121214] border border-[#27272A] p-8 md:p-10 rounded-sm shadow-2xl relative">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full text-[#D4AF37] mb-2">
            <Lock size={20} />
          </div>
          <h1 className="text-xl font-display text-white font-medium tracking-wide">Area Amministratore</h1>
          <p className="text-[10px] text-[#A1A1AA] uppercase tracking-luxurious">Inserisci le credenziali di accesso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-950/20 border border-red-500/35 text-red-400 text-xs text-center rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="pass" className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Password di Accesso
            </label>
            <input
              type="password"
              id="pass"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-center text-white px-4 py-3 rounded-sm outline-none transition"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] disabled:bg-[#D4AF37]/50 text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition rounded-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin text-[#0B0B0C]" /> : 'Accedi al Sistema'}
          </button>
        </form>
      </div>

    </div>
  );
}

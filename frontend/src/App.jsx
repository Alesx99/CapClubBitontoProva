import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BistrotPage from './pages/BistrotPage';
import SportPage from './pages/SportPage';
import PrivateEventsPage from './pages/PrivateEventsPage';
import BookingPage from './pages/BookingPage';
import ContactsPage from './pages/ContactsPage';
import PublicMenu from './pages/PublicMenu';
import PublicEventMenu from './pages/PublicEventMenu';
import Admin from './pages/Admin';
import AdminQr from './pages/AdminQr';
import PrintMenu from './pages/PrintMenu';
import PrintEventMenu from './pages/PrintEventMenu';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chi-siamo" element={<AboutUs />} />
        <Route path="/bistrot" element={<BistrotPage />} />
        <Route path="/sport" element={<SportPage />} />
        <Route path="/eventi-privati" element={<PrivateEventsPage />} />
        <Route path="/prenota" element={<BookingPage />} />
        <Route path="/contatti" element={<ContactsPage />} />
        <Route path="/menu" element={<PublicMenu />} />
        <Route path="/eventi" element={<PublicEventMenu />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/qr" element={<AdminQr />} />
        <Route path="/print" element={<PrintMenu />} />
        <Route path="/print-event" element={<PrintEventMenu />} />
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0B0C] text-[#E4E4E7] p-4 text-center">
            <h1 className="text-7xl font-display text-[#D4AF37] mb-4">404</h1>
            <h2 className="text-xl font-sans tracking-luxurious uppercase text-[#E4E4E7] mb-6">Pagina Non Trovata</h2>
            <p className="text-[#A1A1AA] max-w-md mx-auto mb-8 font-sans">
              La pagina che stai cercando non esiste o è stata spostata nell'area riservata del club.
            </p>
            <a href="#/" className="inline-block px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition duration-300 font-sans tracking-luxurious uppercase text-xs font-semibold">
              Torna alla Home
            </a>
          </div>
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;

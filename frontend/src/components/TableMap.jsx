import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Calendar, Clock, User, Phone, CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight, UserPlus, HelpCircle 
} from 'lucide-react';

export default function TableMap({ bookings, onBookingsChanged }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState('Cena'); // 'Pranzo', 'Aperitif', 'Cena'
  const [occupancy, setOccupancy] = useState([]); // Manually blocked tables
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null); // Clicked table inspection
  const [assigningBooking, setAssigningBooking] = useState(null); // Booking currently being assigned

  // Fetch manual occupancy details
  const fetchOccupancy = async () => {
    setLoading(true);
    try {
      const data = await api.getTableOccupancy(selectedDate, selectedSlot);
      setOccupancy(data);
    } catch (err) {
      console.error('Failed to load table occupancy:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccupancy();
    setSelectedTable(null);
    setAssigningBooking(null);
  }, [selectedDate, selectedSlot]);

  // Define table structures across zones
  const zones = [
    { name: 'Bistrot Lounge', tables: [1, 2, 3, 4, 5, 6, 7, 8] },
    { name: 'Terrazza Piscina', tables: [9, 10, 11, 12, 13, 14, 15, 16] },
    { name: 'Sport Bar', tables: [17, 18, 19, 20, 21, 22, 23, 24] },
    { name: 'Area VIP', tables: [25, 26, 27, 28, 29, 30] }
  ];

  // Helper to determine if a booking fits the selected slot
  const fitsTimeSlot = (time, slot) => {
    if (!time) return false;
    const hour = parseInt(time.split(':')[0], 10);
    if (slot === 'Pranzo') return hour >= 12 && hour < 16;
    if (slot === 'Aperitivo') return hour >= 16 && hour < 20;
    if (slot === 'Cena') return hour >= 20 && hour < 24;
    return false;
  };

  // Filter bookings for the selected date and slot
  const slotBookings = bookings.filter(b => 
    b.date === selectedDate && 
    b.status === 'confirmed' && 
    b.type === 'Tavolo Bistrot' &&
    fitsTimeSlot(b.time, selectedSlot)
  );

  // Get table status maps
  const getTableStatus = (tableNum) => {
    // 1. Check if occupied by a booking
    const booking = slotBookings.find(b => b.assigned_table === tableNum);
    if (booking) {
      return { status: 'reserved', detail: booking };
    }

    // 2. Check if manually blocked
    const manualBlock = occupancy.find(o => o.table_number === tableNum && o.status === 'occupied');
    if (manualBlock) {
      return { status: 'occupied', detail: manualBlock };
    }

    // 3. Otherwise available
    return { status: 'available', detail: null };
  };

  // Toggle manual walk-in table status
  const handleToggleManualOccupancy = async (tableNum, currentStatus) => {
    const nextStatus = currentStatus === 'occupied' ? 'available' : 'occupied';
    try {
      const updated = await api.toggleTableOccupancy(selectedDate, selectedSlot, tableNum, nextStatus);
      setOccupancy(updated);
      // Refresh local select detail
      setSelectedTable({ 
        number: tableNum, 
        ...getTableStatus(tableNum),
        status: nextStatus // Local override till re-render
      });
    } catch (err) {
      alert(`Errore: ${err.message}`);
    }
  };

  // Assign table to booking
  const handleAssignTable = async (tableNum) => {
    if (!assigningBooking) return;
    try {
      await api.assignTable(assigningBooking.id, tableNum);
      setAssigningBooking(null);
      onBookingsChanged(); // Trigger parent reload
    } catch (err) {
      alert(`Errore nell'assegnazione: ${err.message}`);
    }
  };

  // Unassign table
  const handleUnassignTable = async (bookingId) => {
    if (!window.confirm('Vuoi liberare questo tavolo per la prenotazione selezionata?')) return;
    try {
      await api.assignTable(bookingId, null);
      setSelectedTable(null);
      onBookingsChanged();
    } catch (err) {
      alert(`Errore nel liberare il tavolo: ${err.message}`);
    }
  };

  // Confirmed bookings in this slot that have NOT been assigned to a table yet
  const unassignedBookings = slotBookings.filter(b => !b.assigned_table);

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Date & Time Slot Filters */}
      <div className="bg-[#121214] border border-[#27272A] p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Date Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Calendar size={18} className="text-[#D4AF37]" />
          <div className="space-y-1 w-full">
            <span className="block text-[8px] font-bold uppercase tracking-wider text-[#A1A1AA]">Seleziona Data</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none transition"
            />
          </div>
        </div>

        {/* Time Slot Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Clock size={18} className="text-[#D4AF37]" />
          <div className="space-y-1.5 w-full">
            <span className="block text-[8px] font-bold uppercase tracking-wider text-[#A1A1AA]">Fascia Oraria</span>
            <div className="flex bg-[#0B0B0C] p-1 border border-[#27272A] rounded-sm">
              {['Pranzo', 'Aperitivo', 'Cena'].map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-sm transition duration-200 ${
                    selectedSlot === slot 
                      ? 'bg-[#D4AF37] text-[#0B0B0C]' 
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-[9px] uppercase tracking-wider font-semibold text-[#A1A1AA] border-t md:border-t-0 md:border-l border-[#27272A] pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[#D4AF37]/75"></span> Libero
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#27272A]"></span> Occupato (Walk-in)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span> Riservato
          </div>
        </div>

      </div>

      {/* Assign Mode Info Banner */}
      {assigningBooking && (
        <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/50 rounded-sm flex items-center justify-between animate-pulse">
          <div className="text-xs text-[#D4AF37] font-semibold">
            ✦ ASSIGNAZIONE TAVOLO: Seleziona un tavolo libero sulla planimetria per ospitare {assigningBooking.name} ({assigningBooking.time})
          </div>
          <button 
            onClick={() => setAssigningBooking(null)}
            className="text-[9px] uppercase font-bold tracking-widest text-[#D4AF37] hover:text-white transition px-3 py-1 border border-[#D4AF37]/30 rounded-sm"
          >
            Annulla
          </button>
        </div>
      )}

      {/* 2. Main Floor Plan Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visual Map Grid */}
        <div className="lg:col-span-8 bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-8 relative">
          {loading && (
            <div className="absolute inset-0 bg-[#121214]/65 backdrop-blur-sm z-30 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#D4AF37]" size={28} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {zones.map(zone => (
              <div key={zone.name} className="border border-[#27272A] bg-[#0B0B0C]/40 p-5 rounded-sm space-y-4">
                <h3 className="text-xs font-display font-medium text-white tracking-wide border-b border-[#27272A] pb-2">
                  {zone.name}
                </h3>
                
                {/* Tables Grid */}
                <div className="grid grid-cols-4 gap-4 justify-items-center">
                  {zone.tables.map(tableNum => {
                    const { status, detail } = getTableStatus(tableNum);
                    const isSelected = selectedTable?.number === tableNum;
                    const isAssigning = !!assigningBooking;
                    const isAvailable = status === 'available';

                    return (
                      <button
                        key={tableNum}
                        onClick={() => {
                          if (isAssigning) {
                            if (isAvailable) {
                              handleAssignTable(tableNum);
                            } else {
                              alert('Questo tavolo non è libero.');
                            }
                          } else {
                            setSelectedTable({ number: tableNum, status, detail });
                          }
                        }}
                        className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center text-xs font-bold transition duration-300 relative ${
                          status === 'reserved' 
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0B0C] shadow-lg shadow-[#D4AF37]/5' 
                            : status === 'occupied'
                            ? 'bg-[#27272A] border-[#A1A1AA]/35 text-[#A1A1AA]'
                            : isAssigning
                            ? 'border-yellow-400 text-yellow-400 bg-yellow-400/5 animate-pulse'
                            : 'border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10'
                        } ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121214]' : ''}`}
                      >
                        T{tableNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar panels (Inspection & Unassigned Bookings) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. Table details inspect card */}
          {selectedTable && (
            <div className="bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#27272A] pb-3">
                <h3 className="font-display text-base text-white">Ispezione Tavolo {selectedTable.number}</h3>
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="text-xs text-[#A1A1AA] hover:text-white"
                >
                  Chiudi
                </button>
              </div>

              {/* Status information */}
              {selectedTable.status === 'reserved' ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-sm space-y-2">
                    <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-wider block">PRENOTAZIONE RISERVATA</span>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <User size={12} className="text-[#D4AF37]" /> {selectedTable.detail.name}
                    </div>
                    <div className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Clock size={12} /> Orario: {selectedTable.detail.time}
                    </div>
                    <div className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Phone size={12} /> Tel: {selectedTable.detail.phone}
                    </div>
                    {selectedTable.detail.notes && (
                      <p className="text-[#A1A1AA]/70 italic mt-2 border-t border-[#27272A] pt-2 whitespace-pre-line leading-relaxed">
                        "{selectedTable.detail.notes}"
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleUnassignTable(selectedTable.detail.id)}
                    className="w-full py-2.5 border border-red-500/40 hover:border-red-500 text-red-500 hover:bg-red-500/5 text-[10px] uppercase font-bold tracking-wider transition rounded-sm"
                  >
                    Libera Tavolo
                  </button>
                </div>
              ) : selectedTable.status === 'occupied' ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#27272A]/30 border border-[#27272A] rounded-sm space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-[#A1A1AA] tracking-wider block">WALK-IN OCCUPATO</span>
                    <p className="text-[#A1A1AA] font-light">Tavolo bloccato manualmente per clienti sprovvisti di prenotazione online.</p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleManualOccupancy(selectedTable.number, 'occupied')}
                    className="w-full py-2.5 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 text-[10px] uppercase font-bold tracking-wider transition rounded-sm"
                  >
                    Rendi Disponibile
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#0B0B0C]/40 border border-[#27272A] rounded-sm space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">TAVOLO LIBERO</span>
                    <p className="text-[#A1A1AA] font-light">Il tavolo è libero per questa fascia oraria. Puoi occuparlo manualmente per walk-in.</p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleManualOccupancy(selectedTable.number, 'available')}
                    className="w-full py-2.5 bg-[#27272A] hover:bg-[#27272A]/80 border border-[#27272A] text-white text-[10px] uppercase font-bold tracking-wider transition rounded-sm"
                  >
                    Segna come Occupato (Walk-in)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* B. Bookings requiring table assignments */}
          <div className="bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-4">
            <h3 className="font-display text-base text-white border-b border-[#27272A] pb-3">
              Da Assegnare <span className="text-xs text-club-muted font-sans font-light">({unassignedBookings.length})</span>
            </h3>

            {unassignedBookings.length === 0 ? (
              <p className="text-xs text-club-muted italic py-6 text-center">Tutte le prenotazioni di questa fascia sono state posizionate.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {unassignedBookings.map(booking => (
                  <div 
                    key={booking.id} 
                    className="p-3 border border-[#27272A] bg-[#0B0B0C] hover:border-[#D4AF37]/50 rounded-sm flex items-center justify-between gap-3 text-xs transition duration-150"
                  >
                    <div>
                      <div className="font-semibold text-white">{booking.name}</div>
                      <div className="text-[10px] text-club-muted flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} /> {booking.time} | {booking.type}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setAssigningBooking(booking)}
                      className="px-2.5 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] border border-[#D4AF37]/35 hover:border-transparent text-[#D4AF37] hover:text-[#0B0B0C] text-[9px] uppercase font-bold tracking-wider transition rounded-sm flex items-center gap-1"
                    >
                      Assegna <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

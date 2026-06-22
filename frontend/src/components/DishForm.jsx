import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function DishForm({ initial, sections, onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    title: initial?.title || '',
    section: initial?.section || (sections.length > 0 ? sections[0] : 'Antipasti'),
    description: initial?.description || '',
    price: initial?.price || 0,
    available: initial?.available !== undefined ? initial.available : true,
    is_event: initial?.is_event !== undefined ? initial.is_event : false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.section.trim()) {
      alert('Titolo e Categoria sono campi obbligatori.');
      return;
    }
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#121214] border border-[#27272A] p-6 rounded-sm shadow-2xl relative animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-display text-white mb-6">
          {initial ? 'Modifica Piatto' : 'Nuovo Piatto'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Nome Piatto
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="E.g. Spaghetto ai Ricci e Caviale"
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-white px-4 py-2.5 rounded-sm outline-none transition"
              autoFocus
            />
          </div>

          {/* Section */}
          <div className="space-y-1.5">
            <label htmlFor="section" className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Categoria
            </label>
            <input
              type="text"
              id="section"
              name="section"
              value={formData.section}
              onChange={handleInputChange}
              required
              placeholder="E.g. Antipasti"
              list="sections-list"
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-white px-4 py-2.5 rounded-sm outline-none transition"
            />
            <datalist id="sections-list">
              {sections.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label htmlFor="price" className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Prezzo (€)
            </label>
            <input
              type="number"
              step="0.10"
              min="0"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-white px-4 py-2.5 rounded-sm outline-none transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
              Descrizione / Ingredienti (max 500 caratteri)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
              placeholder="Fornisci gli ingredienti o la storia di questo piatto..."
              className="w-full bg-[#0B0B0C] border border-[#27272A] focus:border-[#D4AF37] text-sm text-white px-4 py-2.5 rounded-sm outline-none transition resize-none"
            ></textarea>
          </div>

          {/* Availability Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="w-4 h-4 rounded-sm border-[#27272A] bg-[#0B0B0C] text-[#D4AF37] focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="available" className="text-xs text-[#E4E4E7] cursor-pointer">
              Disponibile nel menù pubblico
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-[#27272A] text-xs font-semibold text-[#A1A1AA] hover:text-white transition rounded-sm"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition rounded-sm"
            >
              {initial ? 'Salva Modifiche' : 'Crea Piatto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

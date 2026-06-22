import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grab, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatPrice } from '../hooks/useMenu';

export default function SortableDish({ item, onEdit, onDelete, onToggle, currencySymbol = '€' }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : item.available ? 1 : 0.6
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center justify-between gap-4 p-4 border border-[#27272A] bg-[#0B0B0C] rounded-sm transition hover:border-[#D4AF37]/30 ${
        !item.available ? 'border-dashed bg-[#0B0B0C]/40' : ''
      }`}
    >
      {/* Drag handle */}
      <button 
        {...attributes} 
        {...listeners}
        type="button"
        className="text-[#A1A1AA] hover:text-[#D4AF37] cursor-grab active:cursor-grabbing p-1"
        title="Trascina per ordinare"
      >
        <Grab size={16} />
      </button>

      {/* Item info */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`font-display font-medium text-sm truncate ${item.available ? 'text-[#E4E4E7]' : 'text-[#A1A1AA]'}`}>
            {item.title}
          </h4>
          {!item.available && (
            <span className="bg-amber-950/20 border border-amber-500/20 text-amber-500 text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm">
              Non Disponibile
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-[#A1A1AA]/70 truncate font-light mt-0.5 max-w-md">
            {item.description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="font-sans text-xs font-semibold text-[#D4AF37] shrink-0 px-2">
        {formatPrice(item.price, currencySymbol)}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        
        {/* Toggle availability */}
        <button
          onClick={() => onToggle(item.id, !item.available)}
          className={`p-1.5 border rounded-sm transition ${
            item.available 
              ? 'bg-[#121214] border-[#27272A] text-emerald-400 hover:border-emerald-500' 
              : 'bg-amber-950/10 border-amber-950/30 text-amber-500 hover:border-amber-500'
          }`}
          title={item.available ? "Nascondi dal menù" : "Mostra nel menù"}
        >
          {item.available ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 bg-[#121214] border border-[#27272A] hover:border-[#D4AF37] text-[#A1A1AA] hover:text-white transition rounded-sm"
          title="Modifica"
        >
          <Edit size={14} />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 bg-red-950/15 border border-red-950/30 hover:border-red-500 text-red-500 hover:text-white transition rounded-sm"
          title="Elimina"
        >
          <Trash2 size={14} />
        </button>

      </div>
    </div>
  );
}

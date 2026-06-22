import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  Plus, ArrowUp, ArrowDown, FolderPlus, HelpCircle, LayoutList 
} from 'lucide-react';
import SortableDish from './SortableDish';
import DishForm from './DishForm';
import { api } from '../api/client';
import { getOrderedSections } from '../hooks/useMenu';

export default function MenuManager({ menu, settings, onChanged, isEvent = false }) {
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  const { items, grouped, sections } = menu;

  // DND Kit Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging a bit to avoid accidental triggers
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event, section) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sectionItems = grouped[section] || [];
    const oldIndex = sectionItems.findIndex(item => item.id === active.id);
    const newIndex = sectionItems.findIndex(item => item.id === over.id);
    
    const reordered = arrayMove(sectionItems, oldIndex, newIndex);
    const orderedIds = reordered.map(item => item.id);

    try {
      await api.reorder(section, orderedIds, isEvent);
      onChanged();
    } catch (err) {
      alert(`Errore nel riordinamento: ${err.message}`);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await api.updateItem(editingItem.id, { ...data, is_event: isEvent });
      } else {
        await api.createItem({ ...data, is_event: isEvent });
      }
      setEditingItem(null);
      setShowAddForm(false);
      onChanged();
    } catch (err) {
      alert(`Errore nel salvataggio: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare definitivamente questo piatto?')) return;
    
    try {
      await api.deleteItem(id);
      onChanged();
    } catch (err) {
      alert(`Errore nella cancellazione: ${err.message}`);
    }
  };

  const handleToggle = async (id, available) => {
    try {
      await api.updateItem(id, { available });
      onChanged();
    } catch (err) {
      alert(`Errore nell'aggiornamento: ${err.message}`);
    }
  };

  // Section Ordering
  const handleMoveSection = async (section, direction) => {
    const currentOrder = getOrderedSections(sections, settings);
    const index = currentOrder.indexOf(section);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    newOrder[index] = currentOrder[newIndex];
    newOrder[newIndex] = currentOrder[index];

    try {
      await api.updateSettings({
        section_order: JSON.stringify(newOrder)
      });
      onChanged();
    } catch (err) {
      alert(`Errore nell'ordinamento categorie: ${err.message}`);
    }
  };

  // Add new blank category
  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    const cleanSection = newSectionName.trim();
    
    const currentOrder = getOrderedSections(sections, settings);
    if (currentOrder.includes(cleanSection)) {
      alert('Questa categoria esiste già.');
      return;
    }

    const newOrder = [...currentOrder, cleanSection];
    try {
      await api.updateSettings({
        section_order: JSON.stringify(newOrder)
      });
      setNewSectionName('');
      alert(`Categoria "${cleanSection}" aggiunta.`);
      onChanged();
    } catch (err) {
      alert(`Errore: ${err.message}`);
    }
  };

  const orderedSections = getOrderedSections(sections, settings);
  const displaySections = selectedSection === 'ALL' ? orderedSections : [selectedSection];

  // Default helper sections for DishForm autocomplete
  const defaultSectionsList = [
    'Antipasti', 'Primi', 'Secondi', 'Contorni', 'Dolci', 'Vini', 'Bevande',
    "Cocktail d'Autore", "Crudi di Mare", "Selezioni Premium Carni", "Menu di Gala"
  ];
  const combinedAutocompleteSections = [...new Set([...sections, ...defaultSectionsList])];

  return (
    <div className="space-y-6">
      
      {/* Filters and Add New Item button bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center no-print">
        
        {/* Dropdown filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] whitespace-nowrap">
            Filtra Sezione:
          </label>
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none w-full sm:w-48 transition"
          >
            <option value="ALL">Tutte le Categorie</option>
            {orderedSections.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        {/* Add Actions */}
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Add Category Form */}
          <form onSubmit={handleAddSection} className="flex gap-2">
            <input 
              type="text"
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              placeholder="Nuova Categoria..."
              className="bg-[#121214] border border-[#27272A] focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-sm outline-none w-36"
            />
            <button 
              type="submit"
              className="p-2 border border-[#27272A] hover:border-[#D4AF37] bg-[#121214] text-[#A1A1AA] hover:text-white rounded-sm transition flex items-center gap-1"
              title="Aggiungi categoria vuota"
            >
              <FolderPlus size={14} />
            </button>
          </form>

          {/* Add Dish Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-xs uppercase tracking-luxurious transition rounded-sm w-full sm:w-auto"
          >
            <Plus size={14} /> Aggiungi Piatto
          </button>
        </div>

      </div>

      {/* Sections and Items List */}
      <div className="space-y-8">
        {displaySections.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#27272A] rounded-sm bg-[#121214]/10">
            <p className="text-sm font-light text-[#A1A1AA]">Nessun piatto configurato per questo menù.</p>
          </div>
        ) : (
          displaySections.map(section => {
            const sectionItems = grouped[section] || [];
            
            return (
              <div key={section} className="bg-[#121214]/50 border border-[#27272A]/70 p-6 rounded-sm space-y-4">
                
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-[#27272A] pb-3 no-print">
                  <h3 className="font-display font-medium text-base text-white tracking-wide">
                    {section} <span className="text-xs font-sans text-club-muted font-light">({sectionItems.length} piatti)</span>
                  </h3>
                  
                  {/* Category arrangement arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveSection(section, 'up')}
                      className="p-1 border border-[#27272A] hover:border-[#D4AF37] text-[#A1A1AA] hover:text-white transition rounded-sm"
                      title="Sposta Categoria Su"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => handleMoveSection(section, 'down')}
                      className="p-1 border border-[#27272A] hover:border-[#D4AF37] text-[#A1A1AA] hover:text-white transition rounded-sm"
                      title="Sposta Categoria Giù"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                </div>

                {/* Print Title (Visible only when print is active if needed) */}
                <h3 className="hidden print:block font-display font-semibold text-lg border-b pb-2 mb-4 text-black">
                  {section}
                </h3>

                {/* Sortable Context for Items in this section */}
                {sectionItems.length === 0 ? (
                  <p className="text-xs text-club-muted italic py-4">Nessun piatto presente in questa categoria.</p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, section)}
                  >
                    <SortableContext
                      items={sectionItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {sectionItems.map(item => (
                          <SortableDish
                            key={item.id}
                            item={item}
                            onEdit={setEditingItem}
                            onDelete={handleDelete}
                            onToggle={handleToggle}
                            currencySymbol={settings.currency_symbol}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Pop-up Modals */}
      {(showAddForm || editingItem) && (
        <DishForm
          initial={editingItem}
          sections={combinedAutocompleteSections}
          onCancel={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
          onSubmit={handleSave}
        />
      )}

    </div>
  );
}

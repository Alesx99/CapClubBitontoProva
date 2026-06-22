import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export const formatPrice = (value, symbol = '€') => {
  if (value === undefined || value === null || isNaN(value)) return `0,00 ${symbol}`;
  const formatted = parseFloat(value).toFixed(2).replace('.', ',');
  return `${formatted} ${symbol}`;
};

export const getOrderedSections = (menuSections, settings) => {
  if (!menuSections || menuSections.length === 0) return [];
  
  let order = [];
  try {
    if (settings && settings.section_order) {
      order = JSON.parse(settings.section_order);
    }
  } catch (e) {
    console.error('Failed to parse section_order:', e);
  }
  
  if (!Array.isArray(order) || order.length === 0) {
    return menuSections.sort(); // Fallback alphabetical
  }
  
  // Sort sections based on order, pushing elements not in order array to the end
  const sorted = [...menuSections].sort((a, b) => {
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
  
  return sorted;
};

export const useMenu = (onlyAvailable = true, isEvent = false) => {
  const [menu, setMenu] = useState({ items: [], grouped: {}, sections: [] });
  const [settings, setSettingsState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuData, settingsData] = await Promise.all([
        api.getMenu(onlyAvailable, isEvent),
        api.getSettings()
      ]);
      
      setMenu(menuData);
      setSettingsState(settingsData);
    } catch (err) {
      console.error('Failed to fetch menu or settings:', err);
      setError(err.message || 'Errore nel caricamento dei dati.');
    } finally {
      setLoading(false);
    }
  }, [onlyAvailable, isEvent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setSettings = useCallback((newSettings) => {
    setSettingsState(newSettings);
  }, []);

  return {
    menu,
    settings,
    loading,
    error,
    reload: fetchData,
    setSettings
  };
};

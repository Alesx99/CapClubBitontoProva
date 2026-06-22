const LOCAL_STORAGE_KEY = 'capclub_admin_pwd';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  return ''; // Dev proxy handles this locally
};

export const setAdminPassword = (pwd) => {
  if (pwd) {
    localStorage.setItem(LOCAL_STORAGE_KEY, pwd);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};

export const getAdminPassword = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || '';
};

export const isAdminLogged = () => {
  return !!getAdminPassword();
};

const request = async (method, path, body = null, isFormData = false) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;
  
  const headers = {};
  const pwd = getAdminPassword();
  if (pwd) {
    headers['x-admin-password'] = pwd;
  }
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const config = {
    method,
    headers,
  };
  
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    let errData;
    try {
      errData = await response.json();
    } catch (e) {
      errData = { error: 'Request failed' };
    }
    throw new Error(errData.message || errData.error || `HTTP error ${response.status}`);
  }
  
  return response.json();
};

// --- MOCK LOCALSTORAGE FALLBACK ENGINE (For GitHub Pages & Offline API) ---
const MOCK_MENU_KEY = 'capclub_mock_menu';
const MOCK_SETTINGS_KEY = 'capclub_mock_settings';
const MOCK_BOOKINGS_KEY = 'capclub_mock_bookings';
const MOCK_OCCUPANCY_KEY = 'capclub_mock_occupancy';

const initMockData = () => {
  if (!localStorage.getItem(MOCK_MENU_KEY)) {
    const defaultMenu = [
      // Cocktails
      { id: 1, section: "Cocktail d'Autore", title: "Royal Champagne Mojito", description: "Rum invecchiato 7 anni, menta, lime, Champagne Brut Royal.", price: 16, available: true, position: 0, is_event: false },
      { id: 2, section: "Cocktail d'Autore", title: "Smoked Negroni Clad", description: "Gin Premium, Vermouth rosso barricato, Bitter Campari affumicato.", price: 15, available: true, position: 1, is_event: false },
      { id: 3, section: "Cocktail d'Autore", title: "Golden Martini", description: "Vodka, Dry Vermouth, zeste di limone, scaglie d'oro edibili 24K.", price: 18, available: true, position: 2, is_event: false },
      // Crudi
      { id: 4, section: "Crudi di Mare", title: "Gran Plateau Royal", description: "Per 2 persone: 4 Ostriche, 4 scampi locali, 4 gamberi rossi Mazara, tartare di tonno.", price: 45, available: true, position: 0, is_event: false },
      { id: 5, section: "Crudi di Mare", title: "Tartare di Salmone Selvaggio", description: "Salmone rosso d'Alaska battuto al coltello, avocado, mela verde.", price: 22, available: true, position: 1, is_event: false },
      // Carni
      { id: 6, section: "Selezioni Premium Carni", title: "Filetto al Tartufo Nero", description: "Filetto di manzo Piemontese, foie gras d'anatra, tartufo nero Norcia.", price: 38, available: true, position: 0, is_event: false },
      { id: 7, section: "Selezioni Premium Carni", title: "Ribeye di Wagyu Giapponese A5", description: "Pregiato taglio di Wagyu (150g) cotto su pietra lavica.", price: 85, available: true, position: 1, is_event: false },
      // Primi
      { id: 8, section: "Primi Piatti", title: "Spaghetto ai Ricci e Caviale Oscietra", description: "Spaghetti Cavalieri, polpa di ricci, burro acido, Caviale Oscietra.", price: 28, available: true, position: 0, is_event: false },
      // Dolci
      { id: 9, section: "I Dolci", title: "Mousse Champagne & Lamponi", description: "Mousse leggera al cioccolato bianco e Champagne, cuore al lampone.", price: 12, available: true, position: 0, is_event: false },
      // Event Menu
      { id: 10, section: "Menu di Gala", title: "Ostrica Imperiale al Caviale", description: "Ostrica del Belon servita con emulsione allo Champagne e caviale.", price: 18, available: true, position: 0, is_event: true },
      { id: 11, section: "Menu di Gala", title: "Tagliolino all'Astice Blu", description: "Tagliolini all'uovo freschi, astice blu della Bretagna, Cognac.", price: 35, available: true, position: 1, is_event: true }
    ];
    localStorage.setItem(MOCK_MENU_KEY, JSON.stringify(defaultMenu));
  }

  if (!localStorage.getItem(MOCK_SETTINGS_KEY)) {
    const defaultSettings = {
      restaurant_name: 'CapClub - Café & Bistrot',
      restaurant_subtitle: 'Café, Sport & Private Club',
      accent_color: '#D4AF37',
      print_frame_color: '#D4AF37',
      font_title: 'Playfair Display',
      font_body: 'Montserrat',
      event_name: 'Gran Galà di Capodanno',
      event_subtitle: 'Exclusive Golden Night'
    };
    localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(defaultSettings));
  }

  if (!localStorage.getItem(MOCK_BOOKINGS_KEY)) {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultBookings = [
      {
        id: 101,
        name: 'Giuseppe Rossi',
        email: 'giuseppe.rossi@example.com',
        phone: '+39 333 9998887',
        type: 'Tavolo Bistrot',
        date: todayStr,
        time: '20:30',
        notes: 'Gradito tavolo vicino alla vetrata.',
        status: 'confirmed',
        assigned_table: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 102,
        name: 'Maria Bianchi',
        email: 'maria.bianchi@example.com',
        phone: '+39 347 1112223',
        type: 'Tavolo Bistrot',
        date: todayStr,
        time: '21:00',
        notes: 'Compleanno di matrimonio.',
        status: 'pending',
        assigned_table: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 103,
        name: 'Marco Russo',
        email: 'marco.russo@example.com',
        phone: '+39 329 4445556',
        type: 'Campo Padel',
        date: todayStr,
        time: '18:30',
        notes: 'Noleggio 4 racchette.',
        status: 'confirmed',
        assigned_table: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(defaultBookings));
  }

  if (!localStorage.getItem(MOCK_OCCUPANCY_KEY)) {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultOccupancy = [
      {
        id: 201,
        date: todayStr,
        slot: 'Cena',
        table_number: 10,
        status: 'occupied',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(MOCK_OCCUPANCY_KEY, JSON.stringify(defaultOccupancy));
  }
};

let useMock = window.location.hostname.endsWith('github.io') || window.location.search.includes('demo=true');

const makeCall = async (fn, mockFn) => {
  if (useMock) {
    return mockFn();
  }
  try {
    return await fn();
  } catch (err) {
    console.warn('Real API call failed. Falling back to local mock client:', err.message || err);
    useMock = true;
    return mockFn();
  }
};

export const api = {
  // Authentication
  login: async (password) => {
    return makeCall(
      async () => {
        const res = await request('POST', '/api/auth/login', { password });
        if (res.ok) {
          setAdminPassword(password);
        }
        return res;
      },
      async () => {
        if (password === 'capclub2026') {
          setAdminPassword(password);
          return { ok: true, message: 'Logged in successfully (Mock Mode)' };
        }
        throw new Error('Password errata (Default Demo Password: capclub2026)');
      }
    );
  },
  
  logout: () => {
    setAdminPassword(null);
  },
  
  // Menu Management
  getMenu: async (onlyAvailable = false, isEvent = false) => {
    return makeCall(
      async () => {
        const params = new URLSearchParams();
        if (onlyAvailable) params.append('available', 'true');
        if (isEvent) params.append('is_event', 'true');
        return request('GET', `/api/menu?${params.toString()}`);
      },
      async () => {
        initMockData();
        const menu = JSON.parse(localStorage.getItem(MOCK_MENU_KEY));
        const items = menu.filter(item => {
          const matchEvent = item.is_event === isEvent;
          const matchAvailable = onlyAvailable ? item.available : true;
          return matchEvent && matchAvailable;
        }).sort((a, b) => a.position - b.position);

        const grouped = {};
        items.forEach(item => {
          if (!grouped[item.section]) {
            grouped[item.section] = [];
          }
          grouped[item.section].push(item);
        });
        const sections = [...new Set(items.map(i => i.section))];
        return { items, grouped, sections };
      }
    );
  },
  
  createItem: async (item) => {
    return makeCall(
      async () => request('POST', '/api/menu', item),
      async () => {
        initMockData();
        const menu = JSON.parse(localStorage.getItem(MOCK_MENU_KEY));
        const newItem = {
          id: Date.now(),
          ...item,
          available: !!item.available,
          is_event: !!item.is_event,
          position: item.position || 0
        };
        menu.push(newItem);
        localStorage.setItem(MOCK_MENU_KEY, JSON.stringify(menu));
        return newItem;
      }
    );
  },
  
  updateItem: async (id, item) => {
    return makeCall(
      async () => request('PUT', `/api/menu/${id}`, item),
      async () => {
        initMockData();
        const menu = JSON.parse(localStorage.getItem(MOCK_MENU_KEY));
        const index = menu.findIndex(i => i.id === parseInt(id) || i.id === id);
        if (index === -1) throw new Error('Piatto non trovato');
        menu[index] = { ...menu[index], ...item };
        localStorage.setItem(MOCK_MENU_KEY, JSON.stringify(menu));
        return menu[index];
      }
    );
  },
  
  deleteItem: async (id) => {
    return makeCall(
      async () => request('DELETE', `/api/menu/${id}`),
      async () => {
        initMockData();
        const menu = JSON.parse(localStorage.getItem(MOCK_MENU_KEY));
        const filtered = menu.filter(i => i.id !== parseInt(id) && i.id !== id);
        localStorage.setItem(MOCK_MENU_KEY, JSON.stringify(filtered));
        return { success: true };
      }
    );
  },
  
  reorder: async (section, orderedIds, isEvent = false) => {
    return makeCall(
      async () => request('POST', '/api/menu/reorder', { section, orderedIds, is_event: isEvent }),
      async () => {
        initMockData();
        const menu = JSON.parse(localStorage.getItem(MOCK_MENU_KEY));
        orderedIds.forEach((id, index) => {
          const match = menu.find(i => i.id === parseInt(id) || i.id === id);
          if (match) match.position = index;
        });
        localStorage.setItem(MOCK_MENU_KEY, JSON.stringify(menu));
        return { success: true };
      }
    );
  },
  
  // Settings Management
  getSettings: async () => {
    return makeCall(
      async () => request('GET', '/api/settings'),
      async () => {
        initMockData();
        return JSON.parse(localStorage.getItem(MOCK_SETTINGS_KEY));
      }
    );
  },
  
  updateSettings: async (patch) => {
    return makeCall(
      async () => request('PUT', '/api/settings', patch),
      async () => {
        initMockData();
        const current = JSON.parse(localStorage.getItem(MOCK_SETTINGS_KEY));
        const updated = { ...current, ...patch };
        localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(updated));
        return updated;
      }
    );
  },
  
  // Uploads
  uploadAsset: async (kind, file) => {
    return makeCall(
      async () => {
        const formData = new FormData();
        formData.append('file', file);
        return request('POST', `/api/upload/${kind}`, formData, true);
      },
      async () => {
        const mockUrl = kind === 'logo'
          ? 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800';
        return { path: mockUrl };
      }
    );
  },
  
  deleteAsset: async (filename) => {
    return makeCall(
      async () => request('DELETE', `/api/upload/${filename}`),
      async () => ({ success: true })
    );
  },

  // Bookings
  createBooking: async (bookingData) => {
    return makeCall(
      async () => request('POST', '/api/booking', bookingData),
      async () => {
        initMockData();
        const bookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY));
        const newBooking = {
          id: Date.now(),
          ...bookingData,
          status: 'pending',
          assigned_table: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(bookings));
        return { 
          success: true, 
          message: 'La tua richiesta è in attesa di approvazione esclusiva. Riceverai un\'email di conferma (Demo).', 
          booking: newBooking 
        };
      }
    );
  },

  getBookings: async () => {
    return makeCall(
      async () => request('GET', '/api/booking/bookings'),
      async () => {
        initMockData();
        return JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY)).sort((a, b) => b.id - a.id);
      }
    );
  },

  updateBookingStatus: async (id, status) => {
    return makeCall(
      async () => request('PUT', `/api/booking/bookings/${id}`, { status }),
      async () => {
        initMockData();
        const bookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY));
        const index = bookings.findIndex(b => b.id === parseInt(id) || b.id === id);
        if (index === -1) throw new Error('Prenotazione non trovata');
        bookings[index].status = status;
        bookings[index].updated_at = new Date().toISOString();
        localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(bookings));
        return bookings[index];
      }
    );
  },

  assignTable: async (id, tableNumber) => {
    return makeCall(
      async () => request('PUT', `/api/booking/bookings/${id}/assign`, { tableNumber }),
      async () => {
        initMockData();
        const bookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY));
        const index = bookings.findIndex(b => b.id === parseInt(id) || b.id === id);
        if (index === -1) throw new Error('Prenotazione non trovata');
        bookings[index].assigned_table = tableNumber ? parseInt(tableNumber, 10) : null;
        bookings[index].updated_at = new Date().toISOString();
        localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(bookings));
        return bookings[index];
      }
    );
  },

  getTableOccupancy: async (date, slot) => {
    return makeCall(
      async () => request('GET', `/api/booking/occupancy?date=${encodeURIComponent(date)}&slot=${encodeURIComponent(slot)}`),
      async () => {
        initMockData();
        const occupancy = JSON.parse(localStorage.getItem(MOCK_OCCUPANCY_KEY));
        return occupancy.filter(o => o.date === date && o.slot === slot);
      }
    );
  },

  toggleTableOccupancy: async (date, slot, tableNumber, status) => {
    return makeCall(
      async () => request('POST', `/api/booking/occupancy/toggle`, { date, slot, tableNumber, status }),
      async () => {
        initMockData();
        let occupancy = JSON.parse(localStorage.getItem(MOCK_OCCUPANCY_KEY));
        const num = parseInt(tableNumber, 10);
        
        if (status === 'occupied') {
          occupancy = occupancy.filter(o => !(o.date === date && o.slot === slot && o.table_number === num));
          occupancy.push({
            id: Date.now(),
            date,
            slot,
            table_number: num,
            status: 'occupied',
            created_at: new Date().toISOString()
          });
        } else {
          occupancy = occupancy.filter(o => !(o.date === date && o.slot === slot && o.table_number === num));
        }
        
        localStorage.setItem(MOCK_OCCUPANCY_KEY, JSON.stringify(occupancy));
        return occupancy.filter(o => o.date === date && o.slot === slot);
      }
    );
  }
};

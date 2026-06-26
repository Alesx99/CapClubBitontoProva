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
const MOCK_MENU_KEY = 'capclub_mock_menu_v2';
const MOCK_SETTINGS_KEY = 'capclub_mock_settings_v2';
const MOCK_BOOKINGS_KEY = 'capclub_mock_bookings';
const MOCK_OCCUPANCY_KEY = 'capclub_mock_occupancy';

const initMockData = () => {
  if (!localStorage.getItem(MOCK_MENU_KEY)) {
    const defaultMenu = [
      // Acqua e Soft Drinks
      { id: 1, section: "Acqua e Soft Drinks", title: "Acqua Grande", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 2, section: "Acqua e Soft Drinks", title: "Acqua Piccola", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 3, section: "Acqua e Soft Drinks", title: "Cedrata", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 4, section: "Acqua e Soft Drinks", title: "Chino' Sanpellegrino", description: "", price: 0, available: true, position: 3, is_event: false },
      { id: 5, section: "Acqua e Soft Drinks", title: "Coca Cola Lattina", description: "", price: 0, available: true, position: 4, is_event: false },
      { id: 6, section: "Acqua e Soft Drinks", title: "Estathe", description: "", price: 0, available: true, position: 5, is_event: false },
      { id: 7, section: "Acqua e Soft Drinks", title: "Fanta Lattina", description: "", price: 0, available: true, position: 6, is_event: false },
      { id: 8, section: "Acqua e Soft Drinks", title: "Lemon Soda", description: "", price: 0, available: true, position: 7, is_event: false },
      { id: 9, section: "Acqua e Soft Drinks", title: "Sprite Lattina", description: "", price: 0, available: true, position: 8, is_event: false },
      { id: 10, section: "Acqua e Soft Drinks", title: "Succo di Frutta", description: "", price: 0, available: true, position: 9, is_event: false },

      // Energy Drinks
      { id: 11, section: "Energy Drinks", title: "Monster", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 12, section: "Energy Drinks", title: "Powerade", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 13, section: "Energy Drinks", title: "Red Bull", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 14, section: "Energy Drinks", title: "Schweppes", description: "", price: 0, available: true, position: 3, is_event: false },

      // Aperitivi e Cocktail
      { id: 15, section: "Aperitivi e Cocktail", title: "Campari Soda", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 16, section: "Aperitivi e Cocktail", title: "Cocktail Sanp", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 17, section: "Aperitivi e Cocktail", title: "Crodino", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 18, section: "Aperitivi e Cocktail", title: "Gin Lemon", description: "", price: 0, available: true, position: 3, is_event: false },
      { id: 19, section: "Aperitivi e Cocktail", title: "Spritz Aperol", description: "", price: 0, available: true, position: 4, is_event: false },
      { id: 20, section: "Aperitivi e Cocktail", title: "Spritz Camp", description: "", price: 0, available: true, position: 5, is_event: false },

      // Amari, Liquori e Distillati
      { id: 21, section: "Amari, Liquori e Distillati", title: "Amaro / Limoncello", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 22, section: "Amari, Liquori e Distillati", title: "Chartreuse", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 23, section: "Amari, Liquori e Distillati", title: "Grappa", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 24, section: "Amari, Liquori e Distillati", title: "Jefferson", description: "", price: 0, available: true, position: 3, is_event: false },

      // Vini e Bollicine
      { id: 25, section: "Vini e Bollicine", title: "Calice Vino", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 26, section: "Vini e Bollicine", title: "Bicchiere Prosecco", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 27, section: "Vini e Bollicine", title: "Bottiglia Ca' Dei Frati", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 28, section: "Vini e Bollicine", title: "Bottiglia Catapanus", description: "", price: 0, available: true, position: 3, is_event: false },
      { id: 29, section: "Vini e Bollicine", title: "Bottiglia Costanza", description: "", price: 0, available: true, position: 4, is_event: false },
      { id: 30, section: "Vini e Bollicine", title: "Bottiglia D'Arapri'", description: "", price: 0, available: true, position: 5, is_event: false },
      { id: 31, section: "Vini e Bollicine", title: "Bottiglia Ele'", description: "", price: 0, available: true, position: 6, is_event: false },
      { id: 32, section: "Vini e Bollicine", title: "Bottiglia Falanghina", description: "", price: 0, available: true, position: 7, is_event: false },
      { id: 33, section: "Vini e Bollicine", title: "Bottiglia Farder Prosecc", description: "", price: 0, available: true, position: 8, is_event: false },
      { id: 34, section: "Vini e Bollicine", title: "Bottiglia Prosecco", description: "", price: 0, available: true, position: 9, is_event: false },
      { id: 35, section: "Vini e Bollicine", title: "Bottiglia Spumante Weart", description: "", price: 0, available: true, position: 10, is_event: false },
      { id: 36, section: "Vini e Bollicine", title: "Bottiglia Vino Imperator", description: "", price: 0, available: true, position: 11, is_event: false },
      { id: 37, section: "Vini e Bollicine", title: "Bottiglia Wheart", description: "", price: 0, available: true, position: 12, is_event: false },
      { id: 38, section: "Vini e Bollicine", title: "Favonio", description: "", price: 0, available: true, position: 13, is_event: false },

      // Pizzeria e Cicci
      { id: 39, section: "Pizzeria e Cicci", title: "4 Formaggi", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 40, section: "Pizzeria e Cicci", title: "4 Stagioni", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 41, section: "Pizzeria e Cicci", title: "American", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 42, section: "Pizzeria e Cicci", title: "Bellavista", description: "", price: 0, available: true, position: 3, is_event: false },
      { id: 43, section: "Pizzeria e Cicci", title: "Brasciola Di Cavallo", description: "", price: 0, available: true, position: 4, is_event: false },
      { id: 44, section: "Pizzeria e Cicci", title: "Calabrese", description: "", price: 0, available: true, position: 5, is_event: false },
      { id: 45, section: "Pizzeria e Cicci", title: "Campana", description: "", price: 0, available: true, position: 6, is_event: false },
      { id: 46, section: "Pizzeria e Cicci", title: "Capricciosa", description: "", price: 0, available: true, position: 7, is_event: false },
      { id: 47, section: "Pizzeria e Cicci", title: "Champignon", description: "", price: 0, available: true, position: 8, is_event: false },
      { id: 48, section: "Pizzeria e Cicci", title: "Ciccio Classico", description: "", price: 0, available: true, position: 9, is_event: false },
      { id: 49, section: "Pizzeria e Cicci", title: "Ciccio Farcito", description: "", price: 0, available: true, position: 10, is_event: false },
      { id: 50, section: "Pizzeria e Cicci", title: "Ciccio Pomodorino", description: "", price: 0, available: true, position: 11, is_event: false },
      { id: 51, section: "Pizzeria e Cicci", title: "Corner", description: "", price: 0, available: true, position: 12, is_event: false },
      { id: 52, section: "Pizzeria e Cicci", title: "Crudaiola", description: "", price: 0, available: true, position: 13, is_event: false },
      { id: 53, section: "Pizzeria e Cicci", title: "Crudo", description: "", price: 0, available: true, position: 14, is_event: false },
      { id: 54, section: "Pizzeria e Cicci", title: "Francesina", description: "", price: 0, available: true, position: 15, is_event: false },
      { id: 55, section: "Pizzeria e Cicci", title: "Prosciutto E Wurstel", description: "", price: 0, available: true, position: 16, is_event: false },
      { id: 56, section: "Pizzeria e Cicci", title: "Pugliese", description: "", price: 0, available: true, position: 17, is_event: false },
      { id: 57, section: "Pizzeria e Cicci", title: "Romana", description: "", price: 0, available: true, position: 18, is_event: false },
      { id: 58, section: "Pizzeria e Cicci", title: "Scattata Barese", description: "", price: 0, available: true, position: 19, is_event: false },
      { id: 59, section: "Pizzeria e Cicci", title: "Sprint", description: "", price: 0, available: true, position: 20, is_event: false },
      { id: 60, section: "Pizzeria e Cicci", title: "Valtellina", description: "", price: 0, available: true, position: 21, is_event: false },
      { id: 61, section: "Pizzeria e Cicci", title: "Vegetariana", description: "", price: 0, available: true, position: 22, is_event: false },
      { id: 62, section: "Pizzeria e Cicci", title: "Wurstel", description: "", price: 0, available: true, position: 23, is_event: false },

      // Panini e Wrap
      { id: 63, section: "Panini e Wrap", title: "American Wrap", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 64, section: "Panini e Wrap", title: "Crispy Burger", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 65, section: "Panini e Wrap", title: "Panino Cotoletta", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 66, section: "Panini e Wrap", title: "Panino Hamburger", description: "", price: 0, available: true, position: 3, is_event: false },
      { id: 67, section: "Panini e Wrap", title: "Panino Hot Dog", description: "", price: 0, available: true, position: 4, is_event: false },

      // Secondi e Insalate
      { id: 68, section: "Secondi e Insalate", title: "Cotoletta", description: "", price: 0, available: true, position: 0, is_event: false },
      { id: 69, section: "Secondi e Insalate", title: "Filetto Al Pepe Verde", description: "", price: 0, available: true, position: 1, is_event: false },
      { id: 70, section: "Secondi e Insalate", title: "Filetto Alla Griglia", description: "", price: 0, available: true, position: 2, is_event: false },
      { id: 71, section: "Secondi e Insalate", title: "Fitness Salad", description: "", price: 0, available: true, position: 3, is_event: false },
      { id: 72, section: "Secondi e Insalate", title: "Hamburger", description: "", price: 0, available: true, position: 4, is_event: false },
      { id: 73, section: "Secondi e Insalate", title: "Tagliata Di Manzo", description: "", price: 0, available: true, position: 5, is_event: false },
      { id: 74, section: "Secondi e Insalate", title: "Tagliata Di Pollo", description: "", price: 0, available: true, position: 6, is_event: false },

      // Servizio
      { id: 75, section: "Servizio", title: "1 Coperto", description: "", price: 0, available: true, position: 0, is_event: false }
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
      event_name: 'Festa Esclusiva CapClub',
      event_subtitle: 'Private Night & Gala Dinner',
      section_order: JSON.stringify([
        "Acqua e Soft Drinks",
        "Energy Drinks",
        "Aperitivi e Cocktail",
        "Amari, Liquori e Distillati",
        "Vini e Bollicine",
        "Pizzeria e Cicci",
        "Panini e Wrap",
        "Secondi e Insalate",
        "Servizio"
      ])
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
        throw new Error('Password errata.');
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

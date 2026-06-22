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

export const api = {
  // Authentication
  login: async (password) => {
    const res = await request('POST', '/api/auth/login', { password });
    if (res.ok) {
      setAdminPassword(password);
    }
    return res;
  },
  
  logout: () => {
    setAdminPassword(null);
  },
  
  // Menu Management
  getMenu: async (onlyAvailable = false, isEvent = false) => {
    const params = new URLSearchParams();
    if (onlyAvailable) params.append('available', 'true');
    if (isEvent) params.append('is_event', 'true');
    
    return request('GET', `/api/menu?${params.toString()}`);
  },
  
  createItem: async (item) => {
    return request('POST', '/api/menu', item);
  },
  
  updateItem: async (id, item) => {
    return request('PUT', `/api/menu/${id}`, item);
  },
  
  deleteItem: async (id) => {
    return request('DELETE', `/api/menu/${id}`);
  },
  
  reorder: async (section, orderedIds, isEvent = false) => {
    return request('POST', '/api/menu/reorder', { section, orderedIds, is_event: isEvent });
  },
  
  // Settings Management
  getSettings: async () => {
    return request('GET', '/api/settings');
  },
  
  updateSettings: async (patch) => {
    return request('PUT', '/api/settings', patch);
  },
  
  // Uploads
  uploadAsset: async (kind, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('POST', `/api/upload/${kind}`, formData, true);
  },
  
  deleteAsset: async (filename) => {
    return request('DELETE', `/api/upload/${filename}`);
  },

  // Bookings (NEW)
  createBooking: async (bookingData) => {
    return request('POST', '/api/booking', bookingData);
  },

  getBookings: async () => {
    return request('GET', '/api/booking/bookings');
  },

  updateBookingStatus: async (id, status) => {
    return request('PUT', `/api/booking/bookings/${id}`, { status });
  },

  assignTable: async (id, tableNumber) => {
    return request('PUT', `/api/booking/bookings/${id}/assign`, { tableNumber });
  },

  getTableOccupancy: async (date, slot) => {
    return request('GET', `/api/booking/occupancy?date=${encodeURIComponent(date)}&slot=${encodeURIComponent(slot)}`);
  },

  toggleTableOccupancy: async (date, slot, tableNumber, status) => {
    return request('POST', `/api/booking/occupancy/toggle`, { date, slot, tableNumber, status });
  }
};

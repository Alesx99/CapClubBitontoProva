const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Helper to log or warn if supabase is not initialized
const checkClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please set SUPABASE_URL and SUPABASE_KEY.');
  }
};

const initSchema = async () => {
  if (!supabase) return;
  // Check if settings table is empty, and insert defaults
  try {
    const { data, error } = await supabase.from('settings').select('key').limit(1);
    if (error) throw error;
    
    if (data.length === 0) {
      const defaultSettings = [
        { key: 'restaurant_name', value: 'CapClub - Café & Bistrot' },
        { key: 'restaurant_subtitle', value: 'Café, Sport & Private Club' },
        { key: 'logo_path', value: '' },
        { key: 'background_path', value: '' },
        { key: 'watermark_path', value: '' },
        { key: 'font_title', value: 'Playfair Display' },
        { key: 'font_body', value: 'Montserrat' },
        { key: 'print_margin_mm', value: '15' },
        { key: 'print_font_size_pt', value: '11' },
        { key: 'print_section_title_center', value: 'false' },
        { key: 'print_section_title_font', value: '' },
        { key: 'print_section_title_size_em', value: '1.4' },
        { key: 'print_body_font', value: '' },
        { key: 'print_body_size_em', value: '1' },
        { key: 'print_subtitle_font', value: '' },
        { key: 'print_subtitle_size_em', value: '1' },
        { key: 'print_frame_enabled', value: 'false' },
        { key: 'print_frame_style', value: 'classic' },
        { key: 'print_frame_color', value: '#D4AF37' },
        { key: 'print_frame_thickness', value: '2' },
        { key: 'print_item_spacing_em', value: '0.3' },
        { key: 'print_section_spacing_em', value: '1' },
        { key: 'print_auto_distribute', value: 'false' },
        { key: 'print_paper_color', value: '#FFFFFF' },
        { key: 'print_paper_opacity', value: '1' },
        { key: 'print_paper_intensity', value: '1' },
        { key: 'accent_color', value: '#D4AF37' },
        { key: 'currency_symbol', value: '€' },
        { key: 'section_order', value: '[]' },
        { key: 'public_base_url', value: '' },
        { key: 'background_position', value: 'center' },
        { key: 'background_size', value: 'cover' },
        { key: 'background_opacity', value: '0.3' },
        { key: 'background_pattern_type', value: 'none' },
        { key: 'background_pattern_color', value: '#D4AF37' },
        { key: 'background_pattern_opacity', value: '0.1' },
        { key: 'background_pattern_size', value: '40' },
        { key: 'watermark_pattern', value: 'none' },
        { key: 'watermark_pattern_size', value: '40' },
        { key: 'watermark_pattern_color', value: '#D4AF37' },
        { key: 'watermark_pattern_opacity', value: '0.08' },
        { key: 'watermark_pattern_thickness', value: '1' },
        { key: 'watermark_pattern_frequency', value: '5' },
        { key: 'watermark_pattern_density', value: '3' },
        { key: 'event_name', value: 'Festa Esclusiva CapClub' },
        { key: 'event_subtitle', value: 'Private Night & Gala Dinner' },
        { key: 'booking_email_receiver', value: process.env.BOOKING_EMAIL_RECEIVER || 'info@capclub.it' }
      ];
      
      await supabase.from('settings').insert(defaultSettings);
    }
  } catch (err) {
    console.error('Failed to initialize Supabase settings:', err);
  }
};

const getAllMenuItems = async (onlyAvailable = false, isEvent = false) => {
  checkClient();
  let query = supabase.from('menu_items').select('*').eq('is_event', isEvent);
  
  if (onlyAvailable) {
    query = query.eq('available', true);
  }
  
  const { data: items, error } = await query.order('section').order('position').order('id');
  if (error) throw error;
  
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.section]) {
      grouped[item.section] = [];
    }
    grouped[item.section].push(item);
  });
  
  const sections = [...new Set(items.map(i => i.section))];
  
  return { items, grouped, sections };
};

const getMenuItemById = async (id) => {
  checkClient();
  const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).single();
  if (error) return null;
  return data;
};

const createMenuItem = async (data) => {
  checkClient();
  const { section, title, description, price, available, position, is_event } = data;
  
  let finalPosition = position;
  if (finalPosition === undefined || finalPosition === null) {
    const { data: maxPosData } = await supabase
      .from('menu_items')
      .select('position')
      .eq('section', section)
      .eq('is_event', is_event)
      .order('position', { ascending: false })
      .limit(1);
    
    finalPosition = (maxPosData && maxPosData.length > 0) ? maxPosData[0].position + 1 : 0;
  }

  const { data: newItem, error } = await supabase
    .from('menu_items')
    .insert([{
      section,
      title,
      description: description || '',
      price,
      available: !!available,
      position: finalPosition,
      is_event: !!is_event
    }])
    .select()
    .single();

  if (error) throw error;
  return newItem;
};

const updateMenuItem = async (id, data) => {
  checkClient();
  const updates = {};
  const updatable = ['section', 'title', 'description', 'price', 'available', 'position', 'is_event'];
  
  updatable.forEach(key => {
    if (data[key] !== undefined) {
      updates[key] = data[key];
    }
  });

  updates.updated_at = new Date().toISOString();

  const { data: updatedItem, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updatedItem;
};

const deleteMenuItem = async (id) => {
  checkClient();
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  return !error;
};

const reorderMenuItems = async (section, orderedIds, isEvent = false) => {
  checkClient();
  // Parallel updates
  const promises = orderedIds.map((id, index) => {
    return supabase
      .from('menu_items')
      .update({ position: index })
      .eq('id', id)
      .eq('section', section)
      .eq('is_event', isEvent);
  });
  
  await Promise.all(promises);
};

const getAllSettings = async () => {
  checkClient();
  const { data, error } = await supabase.from('settings').select('*');
  if (error) throw error;
  
  const settings = {};
  data.forEach(r => {
    settings[r.key] = r.value;
  });
  return settings;
};

const upsertSettings = async (entries) => {
  checkClient();
  const upserts = entries.map(([key, value]) => ({
    key,
    value: value !== null && value !== undefined ? String(value) : ''
  }));

  const { error } = await supabase.from('settings').upsert(upserts);
  if (error) throw error;
  
  return getAllSettings();
};

// BOOKINGS OPERATIONS (NEW)
const createBooking = async (data) => {
  checkClient();
  const { name, email, phone, type, date, time, notes } = data;
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      name,
      email,
      phone,
      type,
      date,
      time,
      notes: notes || '',
      status: 'pending'
    }])
    .select()
    .single();
    
  if (error) throw error;
  return booking;
};

const getAllBookings = async () => {
  checkClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false });
    
  if (error) throw error;
  return data;
};

const updateBookingStatus = async (id, status) => {
  checkClient();
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

const assignTable = async (bookingId, tableNumber) => {
  checkClient();
  const val = tableNumber !== null && tableNumber !== undefined ? parseInt(tableNumber, 10) : null;
  const { data, error } = await supabase
    .from('bookings')
    .update({ assigned_table: val, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

const getTableOccupancy = async (date, slot) => {
  checkClient();
  const { data, error } = await supabase
    .from('table_occupancy')
    .select('*')
    .eq('date', date)
    .eq('slot', slot);
    
  if (error) throw error;
  return data;
};

const toggleTableOccupancy = async (date, slot, tableNumber, status) => {
  checkClient();
  const num = parseInt(tableNumber, 10);
  if (status === 'occupied') {
    const { error } = await supabase
      .from('table_occupancy')
      .upsert({ date, slot, table_number: num, status });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('table_occupancy')
      .delete()
      .eq('date', date)
      .eq('slot', slot)
      .eq('table_number', num);
    if (error) throw error;
  }
  return getTableOccupancy(date, slot);
};

// STORAGE OPERATIONS
const uploadFile = async (bucket, filePath, buffer, contentType) => {
  checkClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType,
      upsert: true
    });
    
  if (error) throw error;
  return data;
};

const deleteFile = async (bucket, filePath) => {
  checkClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
    
  if (error) throw error;
  return data;
};

const getPublicUrl = (bucket, filePath) => {
  checkClient();
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

module.exports = {
  initSchema,
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
  getAllSettings,
  upsertSettings,
  createBooking,
  getAllBookings,
  updateBookingStatus,
  assignTable,
  getTableOccupancy,
  toggleTableOccupancy,
  uploadFile,
  deleteFile,
  getPublicUrl
};

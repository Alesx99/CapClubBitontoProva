const fs = require('fs');
const path = require('path');

const useSupabase = !!process.env.SUPABASE_URL;

if (useSupabase) {
  // If Supabase is configured, use the Supabase database module
  module.exports = require('./supabase');
} else {
  // Otherwise, use native Node.js SQLite (DatabaseSync in Node 22, Database in Node 24)
  const sqliteModule = require('node:sqlite');
  const Database = sqliteModule.DatabaseSync || sqliteModule.Database;
  
  // Ensure data directory and backups directory exist
  const dataDir = path.join(__dirname, '../../data');
  const backupsDir = path.join(dataDir, 'backups');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'capclub.db');
  
  // Auto-backup before initializing
  if (fs.existsSync(dbPath)) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupsDir, `capclub-${timestamp}.db`);
      fs.copyFileSync(dbPath, backupPath);
      
      // Rotate backups: keep max 5
      const backups = fs.readdirSync(backupsDir)
        .filter(f => f.startsWith('capclub-') && f.endsWith('.db'))
        .map(f => ({ name: f, time: fs.statSync(path.join(backupsDir, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time);
      
      if (backups.length > 5) {
        for (let i = 5; i < backups.length; i++) {
          fs.unlinkSync(path.join(backupsDir, backups[i].name));
        }
      }
    } catch (e) {
      console.error('Database backup failed:', e);
    }
  }

  const db = new Database(dbPath);

  // Initialize DB Schema
  const initSchema = () => {
    // Enable WAL mode for performance
    db.exec('PRAGMA journal_mode = WAL;');
    
    // Create menu_items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        price REAL NOT NULL DEFAULT 0,
        available INTEGER NOT NULL DEFAULT 1,
        position INTEGER NOT NULL DEFAULT 0,
        is_event INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    db.exec(`CREATE INDEX IF NOT EXISTS idx_menu_section_position ON menu_items(section, position);`);

    // Create settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Create bookings table (NEW)
    db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        notes TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        assigned_table INTEGER DEFAULT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Create table_occupancy table (NEW)
    db.exec(`
      CREATE TABLE IF NOT EXISTS table_occupancy (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        slot TEXT NOT NULL,
        table_number INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        UNIQUE(date, slot, table_number)
      );
    `);

    // Load default settings
    const defaultSettings = [
      ['restaurant_name', 'CapClub - Café & Bistrot'],
      ['restaurant_subtitle', 'Café, Sport & Private Club'],
      ['logo_path', ''],
      ['background_path', ''],
      ['watermark_path', ''],
      ['font_title', 'Playfair Display'],
      ['font_body', 'Montserrat'],
      ['print_margin_mm', '15'],
      ['print_font_size_pt', '11'],
      ['print_section_title_center', 'false'],
      ['print_section_title_font', ''],
      ['print_section_title_size_em', '1.4'],
      ['print_body_font', ''],
      ['print_body_size_em', '1'],
      ['print_subtitle_font', ''],
      ['print_subtitle_size_em', '1'],
      ['print_frame_enabled', 'false'],
      ['print_frame_style', 'classic'],
      ['print_frame_color', '#D4AF37'],
      ['print_frame_thickness', '2'],
      ['print_item_spacing_em', '0.3'],
      ['print_section_spacing_em', '1'],
      ['print_auto_distribute', 'false'],
      ['print_paper_color', '#FFFFFF'],
      ['print_paper_opacity', '1'],
      ['print_paper_intensity', '1'],
      ['accent_color', '#D4AF37'],
      ['currency_symbol', '€'],
      ['section_order', '[]'],
      ['public_base_url', ''],
      ['background_position', 'center'],
      ['background_size', 'cover'],
      ['background_opacity', '0.3'],
      ['background_pattern_type', 'none'],
      ['background_pattern_color', '#D4AF37'],
      ['background_pattern_opacity', '0.1'],
      ['background_pattern_size', '40'],
      ['watermark_pattern', 'none'],
      ['watermark_pattern_size', '40'],
      ['watermark_pattern_color', '#D4AF37'],
      ['watermark_pattern_opacity', '0.08'],
      ['watermark_pattern_thickness', '1'],
      ['watermark_pattern_frequency', '5'],
      ['watermark_pattern_density', '3'],
      ['event_name', 'Festa Esclusiva CapClub'],
      ['event_subtitle', 'Private Night & Gala Dinner'],
      ['booking_email_receiver', process.env.BOOKING_EMAIL_RECEIVER || 'info@capclub.it']
    ];

    const insertStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of defaultSettings) {
      insertStmt.run(key, value);
    }
  };

  // MENU ITEMS OPERATIONS
  const getAllMenuItems = (onlyAvailable = false, isEvent = false) => {
    let sql = 'SELECT * FROM menu_items WHERE is_event = ?';
    const params = [isEvent ? 1 : 0];
    
    if (onlyAvailable) {
      sql += ' AND available = 1';
    }
    
    sql += ' ORDER BY section, position, id';
    
    const items = db.prepare(sql).all(...params);
    
    // Group items by section
    const grouped = {};
    items.forEach(item => {
      // Normalize availability to bool
      item.available = !!item.available;
      item.is_event = !!item.is_event;
      
      if (!grouped[item.section]) {
        grouped[item.section] = [];
      }
      grouped[item.section].push(item);
    });
    
    // Get unique section names
    const sections = [...new Set(items.map(i => i.section))];
    
    return { items, grouped, sections };
  };

  const getMenuItemById = (id) => {
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    if (item) {
      item.available = !!item.available;
      item.is_event = !!item.is_event;
    }
    return item || null;
  };

  const createMenuItem = (data) => {
    const { section, title, description, price, available, position, is_event } = data;
    
    // Auto-calculate position if not provided
    let finalPosition = position;
    if (finalPosition === undefined || finalPosition === null) {
      const maxPosRow = db.prepare('SELECT MAX(position) as max_pos FROM menu_items WHERE section = ? AND is_event = ?')
        .get(section, is_event ? 1 : 0);
      finalPosition = (maxPosRow && maxPosRow.max_pos !== null) ? maxPosRow.max_pos + 1 : 0;
    }

    const info = db.prepare(`
      INSERT INTO menu_items (section, title, description, price, available, position, is_event)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      section,
      title,
      description || '',
      price,
      available ? 1 : 0,
      finalPosition,
      is_event ? 1 : 0
    );

    return getMenuItemById(info.lastInsertRowid);
  };

  const updateMenuItem = (id, data) => {
    const fields = [];
    const params = [];
    
    const updatable = ['section', 'title', 'description', 'price', 'available', 'position', 'is_event'];
    
    updatable.forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === 'available' || key === 'is_event' ? (data[key] ? 1 : 0) : data[key]);
      }
    });

    if (fields.length === 0) return getMenuItemById(id);

    fields.push("updated_at = datetime('now')");
    params.push(id);

    const sql = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`;
    const info = db.prepare(sql).run(...params);

    if (info.changes === 0) return null;
    return getMenuItemById(id);
  };

  const deleteMenuItem = (id) => {
    const info = db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    return info.changes > 0;
  };

  const reorderMenuItems = (section, orderedIds, isEvent = false) => {
    // Wrap in a transaction
    db.exec('BEGIN TRANSACTION;');
    try {
      const stmt = db.prepare('UPDATE menu_items SET position = ? WHERE id = ? AND section = ? AND is_event = ?');
      orderedIds.forEach((id, index) => {
        stmt.run(index, id, section, isEvent ? 1 : 0);
      });
      db.exec('COMMIT;');
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  };

  // SETTINGS OPERATIONS
  const getAllSettings = () => {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });
    return settings;
  };

  const upsertSettings = (entries) => {
    db.exec('BEGIN TRANSACTION;');
    try {
      const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      for (const [key, value] of entries) {
        stmt.run(key, value !== null && value !== undefined ? String(value) : '');
      }
      db.exec('COMMIT;');
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
    return getAllSettings();
  };

  // BOOKINGS OPERATIONS (NEW)
  const createBooking = (data) => {
    const { name, email, phone, type, date, time, notes } = data;
    const info = db.prepare(`
      INSERT INTO bookings (name, email, phone, type, date, time, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(name, email, phone, type, date, time, notes || '');
    
    return getBookingById(info.lastInsertRowid);
  };

  const getBookingById = (id) => {
    return db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) || null;
  };

  const getAllBookings = () => {
    return db.prepare('SELECT * FROM bookings ORDER BY date DESC, time DESC').all();
  };

  const updateBookingStatus = (id, status) => {
    const info = db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
    if (info.changes === 0) return null;
    return getBookingById(id);
  };

  const assignTable = (bookingId, tableNumber) => {
    const val = tableNumber !== null && tableNumber !== undefined ? parseInt(tableNumber, 10) : null;
    const info = db.prepare("UPDATE bookings SET assigned_table = ?, updated_at = datetime('now') WHERE id = ?").run(val, bookingId);
    if (info.changes === 0) return null;
    return getBookingById(bookingId);
  };

  const getTableOccupancy = (date, slot) => {
    return db.prepare("SELECT * FROM table_occupancy WHERE date = ? AND slot = ?").all(date, slot);
  };

  const toggleTableOccupancy = (date, slot, tableNumber, status) => {
    const num = parseInt(tableNumber, 10);
    if (status === 'occupied') {
      db.prepare("INSERT OR REPLACE INTO table_occupancy (date, slot, table_number, status) VALUES (?, ?, ?, ?)").run(date, slot, num, 'occupied');
    } else {
      db.prepare("DELETE FROM table_occupancy WHERE date = ? AND slot = ? AND table_number = ?").run(date, slot, num);
    }
    return getTableOccupancy(date, slot);
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
    getBookingById,
    getAllBookings,
    updateBookingStatus,
    assignTable,
    getTableOccupancy,
    toggleTableOccupancy
  };
}

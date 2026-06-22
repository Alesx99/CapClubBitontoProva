const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { requireAdmin } = require('../middleware/auth');

// Whitelist of settings that can be updated via PUT
const ALLOWED_KEYS = new Set([
  'restaurant_name',
  'restaurant_subtitle',
  'logo_path',
  'background_path',
  'watermark_path',
  'font_title',
  'font_body',
  'print_margin_mm',
  'print_font_size_pt',
  'print_section_title_center',
  'print_section_title_font',
  'print_section_title_size_em',
  'print_body_font',
  'print_body_size_em',
  'print_subtitle_font',
  'print_subtitle_size_em',
  'print_frame_enabled',
  'print_frame_style',
  'print_frame_color',
  'print_frame_thickness',
  'accent_color',
  'currency_symbol',
  'section_order',
  'watermark_pattern',
  'watermark_pattern_size',
  'watermark_pattern_color',
  'watermark_pattern_opacity',
  'watermark_pattern_thickness',
  'watermark_pattern_frequency',
  'watermark_pattern_density',
  'print_paper_color',
  'print_paper_opacity',
  'print_paper_intensity',
  'public_base_url',
  'print_item_spacing_em',
  'print_section_spacing_em',
  'print_auto_distribute',
  'event_name',
  'event_subtitle',
  'booking_email_receiver' // Added to whitelist
]);

// GET /api/settings - Retrieve all settings
router.get('/', async (req, res) => {
  try {
    const settings = await db.getAllSettings();
    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// PUT /api/settings - Update settings (partial patch)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const patch = req.body;
    if (!patch || typeof patch !== 'object') {
      return res.status(400).json({ error: 'Invalid settings patch body' });
    }

    const filteredEntries = Object.entries(patch).filter(([key]) => {
      return ALLOWED_KEYS.has(key);
    });

    if (filteredEntries.length === 0) {
      return res.status(400).json({ error: 'No writable settings keys provided' });
    }

    const updated = await db.upsertSettings(filteredEntries);
    res.json(updated);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;

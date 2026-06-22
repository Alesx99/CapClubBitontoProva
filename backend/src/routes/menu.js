const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { requireAdmin } = require('../middleware/auth');
const { validateMenuItem } = require('../middleware/validate');

// GET /api/menu - Retrieve all items (grouped by section)
router.get('/', async (req, res) => {
  try {
    const onlyAvailable = req.query.available === 'true';
    const isEvent = req.query.is_event === 'true';
    
    const result = await db.getAllMenuItems(onlyAvailable, isEvent);
    res.json(result);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// GET /api/menu/:id - Retrieve single menu item
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const item = await db.getMenuItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// POST /api/menu - Create a menu item
router.post('/', requireAdmin, validateMenuItem, async (req, res) => {
  try {
    const newItem = await db.createMenuItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// PUT /api/menu/:id - Update a menu item
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const existing = await db.getMenuItemById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    const updated = await db.updateMenuItem(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// DELETE /api/menu/:id - Delete a menu item
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const existing = await db.getMenuItemById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    const success = await db.deleteMenuItem(id);
    res.json({ success });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// POST /api/menu/reorder - Reorder menu items within a section
router.post('/reorder', requireAdmin, async (req, res) => {
  try {
    const { section, orderedIds, is_event } = req.body;
    
    if (!section || !Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'Missing section or orderedIds' });
    }
    
    const isEvent = !!is_event;
    await db.reorderMenuItems(section, orderedIds, isEvent);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error reordering menu items:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;

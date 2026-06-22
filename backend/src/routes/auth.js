const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'capclub2026';

  if (!password || password !== adminPassword) {
    return res.status(401).json({ ok: false, error: 'Incorrect password' });
  }

  res.json({ ok: true });
});

module.exports = router;

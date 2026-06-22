const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { rateLimit } = require('express-rate-limit');
require('dotenv').config();

const { initSchema } = require('./db/index');

// Create Express App
const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize Schema
try {
  initSchema();
  console.log('Database initialized successfully.');
} catch (err) {
  console.error('Error initializing database:', err);
}

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: { error: 'Too many login attempts. Please try again in 5 minutes.' },
});

// Ensure uploads folder exists locally
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static Files
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

// Import API Routers
const authRouter = require('./routes/auth');
const menuRouter = require('./routes/menu');
const settingsRouter = require('./routes/settings');
const uploadRouter = require('./routes/upload');
const bookingRouter = require('./routes/booking'); // NEW

// Bind API Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/booking', bookingRouter); // NEW

// SPA Frontend Fallback
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*all', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send('CapClub API is running. Build frontend to view the website.');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Detect LAN IP helper
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if ((iface.family === 'IPv4' || iface.family === 4) && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start Server
app.listen(PORT, HOST, () => {
  const lanIp = getLocalIp();
  console.log(`\n==================================================`);
  console.log(`CapClub Server running on port ${PORT}`);
  console.log(`Local Access: http://localhost:${PORT}`);
  console.log(`LAN Access:   http://${lanIp}:${PORT}`);
  console.log(`Environment:  ${process.env.NODE_ENV}`);
  console.log(`==================================================\n`);
});

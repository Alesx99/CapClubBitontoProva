require('dotenv').config();

const requireAdmin = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'capclub2026';
  const requestPassword = req.headers['x-admin-password'];

  if (!requestPassword || requestPassword !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized. Incorrect or missing admin password.' });
  }

  next();
};

module.exports = {
  requireAdmin
};

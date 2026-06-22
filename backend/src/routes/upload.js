const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const { requireAdmin } = require('../middleware/auth');
const db = require('../db/index');

const maxUploadSize = (parseInt(process.env.MAX_UPLOAD_MB, 10) || 5) * 1024 * 1024;

// Configure Multer Storage in memory so we can direct it to either local disk or Supabase
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: maxUploadSize },
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const allowedExt = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and SVG are allowed.'));
    }
  }
});

const uploadsLocalDir = path.join(__dirname, '../../uploads');

// POST /api/upload/:kind
router.post('/:kind', requireAdmin, (req, res) => {
  const { kind } = req.params;
  if (!['logo', 'background', 'watermark'].includes(kind)) {
    return res.status(400).json({ error: 'Invalid upload kind' });
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const uniqueName = `${kind}-${Date.now()}-${nanoid(6)}${ext}`;
      
      const useSupabase = !!process.env.SUPABASE_URL;
      
      if (useSupabase) {
        // Supabase Cloud Upload
        const supabaseDb = require('../db/supabase');
        await supabaseDb.uploadFile('assets', uniqueName, req.file.buffer, req.file.mimetype);
        const publicUrl = supabaseDb.getPublicUrl('assets', uniqueName);
        res.json({ filepath: publicUrl, filename: uniqueName });
      } else {
        // Local Disk Upload
        if (!fs.existsSync(uploadsLocalDir)) {
          fs.mkdirSync(uploadsLocalDir, { recursive: true });
        }
        
        const localPath = path.join(uploadsLocalDir, uniqueName);
        fs.writeFileSync(localPath, req.file.buffer);
        
        // Relative path for local serving
        const relativeUrl = `/uploads/${uniqueName}`;
        res.json({ filepath: relativeUrl, filename: uniqueName });
      }
    } catch (uploadErr) {
      console.error('File upload error:', uploadErr);
      res.status(500).json({ error: 'Failed to upload asset', message: uploadErr.message });
    }
  });
});

// DELETE /api/upload/:filename
router.delete('/:filename', requireAdmin, async (req, res) => {
  const { filename } = req.params;
  
  // Basic security check: protect against path traversal
  const safeFilenameRegex = /^[a-z0-9_\-.]+$/i;
  if (!safeFilenameRegex.test(filename)) {
    return res.status(400).json({ error: 'Invalid file name' });
  }

  try {
    const useSupabase = !!process.env.SUPABASE_URL;
    
    if (useSupabase) {
      const supabaseDb = require('../db/supabase');
      await supabaseDb.deleteFile('assets', filename);
      res.json({ success: true });
    } else {
      const localFilePath = path.join(uploadsLocalDir, filename);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'File not found locally' });
      }
    }
  } catch (err) {
    console.error('File deletion error:', err);
    res.status(500).json({ error: 'Failed to delete asset', message: err.message });
  }
});

module.exports = router;

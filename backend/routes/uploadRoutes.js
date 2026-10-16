import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads', 'sarees');
const frontendPublicDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'sarees');

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(frontendPublicDir)) {
  fs.mkdirSync(frontendPublicDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `personal_saree_${Date.now()}_${Math.round(Math.random() * 1e4)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are permitted!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter
});

// Single image upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const filename = req.file.filename;
    const destPath = path.join(frontendPublicDir, filename);

    // If local frontend/public exists (e.g. monorepo development), copy for convenience
    try {
      if (fs.existsSync(frontendPublicDir)) {
        fs.copyFileSync(req.file.path, destPath);
      }
    } catch (copyErr) {
      // Harmless on isolated cloud instances like Render
    }

    // Always return the standard backend upload path
    const uploadUrl = `/uploads/sarees/${filename}`;

    res.json({
      success: true,
      message: 'Personal saree image uploaded successfully',
      imageUrl: uploadUrl,
      backendUrl: uploadUrl,
      filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

// Multiple images upload
router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const urls = req.files.map(file => {
      const filename = file.filename;
      try {
        if (fs.existsSync(frontendPublicDir)) {
          fs.copyFileSync(file.path, path.join(frontendPublicDir, filename));
        }
      } catch (e) {}
      return `/uploads/sarees/${filename}`;
    });

    res.json({
      success: true,
      message: `${req.files.length} saree images uploaded successfully`,
      imageUrls: urls
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

export default router;

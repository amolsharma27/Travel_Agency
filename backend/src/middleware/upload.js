import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary, { cloudinaryEnabled } from '../config/cloudinary.js';

let storage;

if (cloudinaryEnabled) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'travel-hotel-platform',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1600, crop: 'limit', quality: 'auto' }],
    },
  });
} else {
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  if (isValid) return cb(null, true);
  cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Helper to read back a usable URL for a file regardless of storage backend
export const fileUrl = (req, file) => {
  if (cloudinaryEnabled) return file.path; // Cloudinary URL
  return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
};

export default upload;

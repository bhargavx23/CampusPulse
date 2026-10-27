import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

/**
 * CampusPulse Evidence Upload Middleware
 * Validates image type/size, uploads directly to Cloudinary.
 * Supported: JPEG, PNG, WebP — max 5 MB.
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memoryStorage so we can validate before uploading
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error('Invalid file type. Only JPEG, PNG, and WebP images are accepted.'),
      false
    );
  }
  cb(null, true);
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
}).single('evidence');

/**
 * Uploads a buffer to Cloudinary and returns the secure URL.
 */
export async function uploadToCloudinary(buffer, originalname, complaintId) {
  return new Promise((resolve, reject) => {
    const publicId = `campuspulse/evidence/${complaintId}_${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: 'image',
        folder: 'campuspulse/evidence',
        overwrite: false,
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto' },
          { width: 1920, height: 1920, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

export function isCloudinaryConfigured() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

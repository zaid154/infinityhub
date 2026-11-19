import multer from 'multer';

// Use memory storage for direct streaming to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg',
    'video/x-matroska'
  ];
  if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Supported formats: JPEG, PNG, WebP images and MP4, WebM, MOV videos.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 60 * 1024 * 1024 // 60MB max file size (supports HD hardware video demos & photos)
  },
  fileFilter
});

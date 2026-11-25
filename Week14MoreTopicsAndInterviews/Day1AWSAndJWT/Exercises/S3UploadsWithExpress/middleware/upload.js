import multer from "multer";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

// memoryStorage keeps the file in req.file.buffer instead of writing it to disk,
// which is what we want because the file goes straight to S3.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter(req, file, callback) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file"));
    }
  },
});

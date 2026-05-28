import multer from "multer";
import path from "path";
import type { Request } from "express";

// Stores uploaded files in memory before sending them to Cloudinary.
// This avoids saving files inside Render's temporary filesystem.
const storage = multer.memoryStorage();

// Validates image file types before allowing the upload.
// Only jpeg, jpg, png, and webp images are accepted.
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const extension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extension && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;

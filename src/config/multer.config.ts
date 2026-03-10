import path from "path";
import fs from "fs";
import multer from "multer";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "hero");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `hero-${uniqueSuffix}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/i.test(file.mimetype);
  if (allowed) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed."));
  }
};

export const uploadHeroImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

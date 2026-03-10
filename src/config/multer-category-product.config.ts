import path from "path";
import fs from "fs";
import multer from "multer";

const CATEGORIES_DIR = path.join(process.cwd(), "uploads", "categories");
const PRODUCTS_DIR = path.join(process.cwd(), "uploads", "products");
const CERTIFICATES_DIR = path.join(process.cwd(), "uploads", "certificates");

[CATEGORIES_DIR, PRODUCTS_DIR, CERTIFICATES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function createStorage(dir: string, prefix: string): multer.StorageEngine {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname) || ".jpg";
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    },
  });
}

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/i.test(file.mimetype);
  if (allowed) cb(null, true);
  else cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed."));
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

export const uploadCategoryImage = multer({
  storage: createStorage(CATEGORIES_DIR, "category"),
  fileFilter,
  limits,
});

export const uploadProductImage = multer({
  storage: createStorage(PRODUCTS_DIR, "product"),
  fileFilter,
  limits,
});

export const uploadCertificateImage = multer({
  storage: createStorage(CERTIFICATES_DIR, "certificate"),
  fileFilter,
  limits,
});

import express from "express";
import {
  getProducts,
  getProductsByCategoryId,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller";
import { uploadProductImage } from "../config/multer-category-product.config";

const router = express.Router();

router.get("/", getProducts);
router.get("/category/:categoryId", getProductsByCategoryId);
router.get("/:id", getProductById);
router.post("/", uploadProductImage.single("image"), createProduct);
router.put("/:id", uploadProductImage.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;

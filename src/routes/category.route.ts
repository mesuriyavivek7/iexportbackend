import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller";
import { uploadCategoryImage } from "../config/multer-category-product.config";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", uploadCategoryImage.single("image"), createCategory);
router.put("/:id", uploadCategoryImage.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;

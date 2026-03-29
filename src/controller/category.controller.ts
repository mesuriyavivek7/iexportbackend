import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import categoryModel from "../models/category.model";
import productModel from "../models/product.model";
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "categories");
const PRODUCTS_UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");
const BASE_URL = (process.env.BASE_URL || "http://localhost:5020").replace(/\/$/, "");

function toFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

function getStoredFilename(imageUrl: string): string {
  return path.basename(imageUrl.split("/").pop() || "");
}

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 }).lean();
    const productCounts = await productModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(productCounts.map((p) => [p._id.toString(), p.count]));
    const data = categories.map((c) => ({
      ...c,
      image: toFullImageUrl(c.image),
      productCount: countMap.get(String(c._id)) ?? 0,
    }));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get categories error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ message: "Category not found", success: false });
    const productCount = await productModel.countDocuments({ category: req.params.id });
    const data = { ...category, image: toFullImageUrl(category.image), productCount };
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get category error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const name = String(req.body.name ?? "").trim();
    if (!name) return res.status(400).json({ message: "Category name is required.", success: false });
    const file = req.file;
    const image = file ? `${BASE_URL}/uploads/categories/${file.filename}` : "";
    const category = await categoryModel.create({ name, image });
    const data = { ...category.toObject(), image: toFullImageUrl(category.image) };
    return res.status(201).json({ message: "Category created.", success: true, data });
  } catch (err) {
    console.error("Create category error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found", success: false });
    const name = req.body.name;
    if (name !== undefined) category.name = String(name).trim();
    const file = req.file;
    if (file) {
      if (category.image) {
        const filename = getStoredFilename(category.image);
        if (filename) {
          const oldPath = path.join(UPLOAD_DIR, filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      category.image = `${BASE_URL}/uploads/categories/${file.filename}`;
    }
    await category.save();
    const data = { ...category.toObject(), image: toFullImageUrl(category.image) };
    return res.status(200).json({ message: "Category updated.", success: true, data });
  } catch (err) {
    console.error("Update category error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found", success: false });

    const products = await productModel.find({ category: req.params.id });
    for (const product of products) {
      if (product.image) {
        const filename = getStoredFilename(product.image);
        if (filename) {
          const filePath = path.join(PRODUCTS_UPLOAD_DIR, filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      }
    }
    await productModel.deleteMany({ category: req.params.id });

    if (category.image) {
      const filename = getStoredFilename(category.image);
      if (filename) {
        const oldPath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    await categoryModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Category and its linked products deleted.",
      success: true,
      deletedProductsCount: products.length,
    });
  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

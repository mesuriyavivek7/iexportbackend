import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import productModel from "../models/product.model";
import categoryModel from "../models/category.model";
import { revalidateNextjs } from "../utils/revalidate";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");
const BASE_URL = (process.env.BASE_URL || "http://localhost:5020").replace(/\/$/, "");

function toFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

function getStoredFilename(imageUrl: string): string {
  return path.basename(imageUrl.split("/").pop() || "");
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const filter = categoryId ? { category: categoryId } : {};
    const products = await productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("category", "name image")
      .lean();
    const data = products.map((p) => ({
      ...p,
      image: toFullImageUrl(p.image),
      category: p.category && typeof p.category === "object" && "image" in p.category
        ? { ...p.category, image: toFullImageUrl((p.category as { image: string }).image) }
        : p.category,
    }));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getProductsByCategoryId = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const category = await categoryModel.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found", success: false });
    const products = await productModel
      .find({ category: categoryId })
      .sort({ createdAt: -1 })
      .populate("category", "name image")
      .lean();
    const data = products.map((p) => ({
      ...p,
      image: toFullImageUrl(p.image),
      category: p.category && typeof p.category === "object" && "image" in p.category
        ? { ...p.category, image: toFullImageUrl((p.category as { image: string }).image) }
        : p.category,
    }));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get products by category error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productModel.findById(req.params.id).populate("category", "name image").lean();
    if (!product) return res.status(404).json({ message: "Product not found", success: false });
    const data = {
      ...product,
      image: toFullImageUrl(product.image),
      category: product.category && typeof product.category === "object" && "image" in product.category
        ? { ...product.category, image: toFullImageUrl((product.category as { image: string }).image) }
        : product.category,
    };
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get product error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const categoryId = req.body.category;
    if (!name) return res.status(400).json({ message: "Product name is required.", success: false });
    if (!categoryId) return res.status(400).json({ message: "Category is required.", success: false });
    const category = await categoryModel.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Invalid category.", success: false });
    const file = req.file;
    const image = file ? `${BASE_URL}/uploads/products/${file.filename}` : "";
    const product = await productModel.create({ name, image, category: categoryId });
    const populated = await product.populate("category", "name image");
    await revalidateNextjs({ tag: "categories" });
    const data = {
      ...populated.toObject(),
      image: toFullImageUrl(populated.image),
      category: populated.category && typeof populated.category === "object" && "image" in populated.category
        ? { ...populated.category, image: toFullImageUrl((populated.category as { image: string }).image) }
        : populated.category,
    };
    return res.status(201).json({ message: "Product created.", success: true, data });
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found", success: false });
    const name = req.body.name;
    const categoryId = req.body.category;
    if (name !== undefined) product.name = String(name).trim();
    if (categoryId !== undefined) {
      const category = await categoryModel.findById(categoryId);
      if (!category) return res.status(400).json({ message: "Invalid category.", success: false });
      product.category = categoryId;
    }
    const file = req.file;
    if (file) {
      if (product.image) {
        const filename = getStoredFilename(product.image);
        if (filename) {
          const oldPath = path.join(UPLOAD_DIR, filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      product.image = `${BASE_URL}/uploads/products/${file.filename}`;
    }
    await product.save();
    await revalidateNextjs({ tag: "categories" });
    const populated = await product.populate("category", "name image");
    const data = {
      ...populated.toObject(),
      image: toFullImageUrl(populated.image),
      category: populated.category && typeof populated.category === "object" && "image" in populated.category
        ? { ...populated.category, image: toFullImageUrl((populated.category as { image: string }).image) }
        : populated.category,
    };
    return res.status(200).json({ message: "Product updated.", success: true, data });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found", success: false });
    if (product.image) {
      const filename = getStoredFilename(product.image);
      if (filename) {
        const oldPath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    await productModel.findByIdAndDelete(req.params.id);
    await revalidateNextjs({ tag: "categories" });
    return res.status(200).json({ message: "Product deleted.", success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

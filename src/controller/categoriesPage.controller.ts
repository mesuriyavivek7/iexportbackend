import { Request, Response } from "express";
import categoriesPageModel from "../models/categoriesPage.model";

export const getCategoriesPage = async (_req: Request, res: Response) => {
  try {
    let doc = await categoriesPageModel.findOne();
    if (!doc) doc = await categoriesPageModel.create({});
    return res.status(200).json({ success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Get categories page error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createCategoriesPage = async (req: Request, res: Response) => {
  try {
    const existing = await categoriesPageModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "Categories page already exists. Use PUT /api/categories-page to update.",
        success: false,
      });
    }
    const { heading, subheading } = req.body;
    const doc = await categoriesPageModel.create({
      heading: heading !== undefined ? String(heading) : "Our Categories",
      subheading: subheading !== undefined ? String(subheading) : "Browse our range of premium products by category.",
    });
    return res.status(201).json({ message: "Categories page created.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Create categories page error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateCategoriesPage = async (req: Request, res: Response) => {
  try {
    const { heading, subheading } = req.body;
    let doc = await categoriesPageModel.findOne();
    if (!doc) doc = await categoriesPageModel.create({});
    if (heading !== undefined) doc.heading = String(heading);
    if (subheading !== undefined) doc.subheading = String(subheading);
    await doc.save();
    return res.status(200).json({ message: "Categories page updated.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Update categories page error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

import { Request, Response } from "express";
import categorySectionModel from "../models/categorySection.model";

export const getCategorySection = async (_req: Request, res: Response) => {
  try {
    let doc = await categorySectionModel.findOne();
    if (!doc) doc = await categorySectionModel.create({});
    return res.status(200).json({ success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Get category section error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createCategorySection = async (req: Request, res: Response) => {
  try {
    const existing = await categorySectionModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "Category section already exists. Use PUT /api/category-section to update.",
        success: false,
      });
    }
    const { heading, subheading } = req.body;
    const doc = await categorySectionModel.create({
      heading: heading !== undefined ? String(heading) : "Crafted by Nature, Delivered with Care",
      subheading: subheading !== undefined ? String(subheading) : "Experience the finest products, sourced responsibly and delivered with uncompromising quality.",
    });
    return res.status(201).json({ message: "Category section created.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Create category section error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateCategorySection = async (req: Request, res: Response) => {
  try {
    const { heading, subheading } = req.body;
    let doc = await categorySectionModel.findOne();
    if (!doc) doc = await categorySectionModel.create({});
    if (heading !== undefined) doc.heading = String(heading);
    if (subheading !== undefined) doc.subheading = String(subheading);
    await doc.save();
    return res.status(200).json({ message: "Category section updated.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Update category section error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

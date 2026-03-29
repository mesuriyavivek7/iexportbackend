import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import aboutHomeModel from "../models/aboutHome.model";
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "about");
const BASE_URL = (process.env.BASE_URL || "http://localhost:5020").replace(/\/$/, "");

function toFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

function getStoredFilename(imageUrl: string): string {
  return path.basename(imageUrl.split("/").pop() || "");
}

function toResponse(doc: { toObject: () => Record<string, unknown>; aboutImage: string }) {
  const data = doc.toObject() as Record<string, unknown>;
  data.aboutImage = toFullImageUrl(doc.aboutImage);
  return data;
}

export const getAboutHome = async (_req: Request, res: Response) => {
  try {
    let doc = await aboutHomeModel.findOne();
    if (!doc) doc = await aboutHomeModel.create({});
    return res.status(200).json({ success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Get about home error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createAboutHome = async (req: Request, res: Response) => {
  try {
    const existing = await aboutHomeModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "About Home section already exists. Use PUT to update.",
        success: false,
      });
    }
    const { heading, subheading, contentParagraph1, contentParagraph2 } = req.body;
    const file = req.file;
    const aboutImage = file ? `${BASE_URL}/uploads/about/${file.filename}` : "";
    const doc = await aboutHomeModel.create({
      aboutImage,
      ...(heading !== undefined && { heading }),
      ...(subheading !== undefined && { subheading }),
      ...(contentParagraph1 !== undefined && { contentParagraph1 }),
      ...(contentParagraph2 !== undefined && { contentParagraph2 }),
    });
    return res.status(201).json({ message: "About Home section created.", success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Create about home error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateAboutHome = async (req: Request, res: Response) => {
  try {
    const { heading, subheading, contentParagraph1, contentParagraph2 } = req.body;
    const file = req.file;
    let doc = await aboutHomeModel.findOne();
    if (!doc) doc = await aboutHomeModel.create({});

    if (heading !== undefined) doc.heading = heading;
    if (subheading !== undefined) doc.subheading = subheading;
    if (contentParagraph1 !== undefined) doc.contentParagraph1 = contentParagraph1;
    if (contentParagraph2 !== undefined) doc.contentParagraph2 = contentParagraph2;

    if (file) {
      if (doc.aboutImage) {
        const filename = getStoredFilename(doc.aboutImage);
        if (filename) {
          const oldPath = path.join(UPLOAD_DIR, filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      doc.aboutImage = `${BASE_URL}/uploads/about/${file.filename}`;
    }
    await doc.save();
    return res.status(200).json({ message: "About Home updated successfully.", success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Update about home error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

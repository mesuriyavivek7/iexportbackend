import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import showcaseSectionModel from "../models/showcaseSection.model";
import { revalidateNextjs } from "../utils/revalidate";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "showcase");
const BASE_URL = (process.env.BASE_URL || "http://localhost:5020").replace(/\/$/, "");

function toFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

function getStoredFilename(imageUrl: string): string {
  return path.basename(imageUrl.split("/").pop() || "");
}

function deleteOldImage(imageUrl: string): void {
  if (!imageUrl) return;
  const filename = getStoredFilename(imageUrl);
  if (!filename) return;
  const filePath = path.join(UPLOAD_DIR, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function getFileByFieldname(files: Express.Multer.File[] | undefined, fieldname: string): Express.Multer.File | undefined {
  if (!Array.isArray(files) || files.length === 0) return undefined;
  return files.find((f) => f.fieldname === fieldname);
}

function parsePoints(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value.map((p) => String(p));
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map((p) => String(p)) : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function toResponse(doc: { image1: string; image2: string; image3: string; toObject: () => object }) {
  const data = doc.toObject() as Record<string, unknown>;
  data.image1 = toFullImageUrl(doc.image1);
  data.image2 = toFullImageUrl(doc.image2);
  data.image3 = toFullImageUrl(doc.image3);
  return data;
}

export const getShowcase = async (_req: Request, res: Response) => {
  try {
    let doc = await showcaseSectionModel.findOne();
    if (!doc) doc = await showcaseSectionModel.create({});
    return res.status(200).json({ success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Get showcase error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createShowcase = async (req: Request, res: Response) => {
  try {
    const existing = await showcaseSectionModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "Showcase section already created. Use PUT /api/showcase to update.",
        success: false,
      });
    }
    const files = req.files as Express.Multer.File[] | undefined;
    const body = req.body as Record<string, unknown>;
    const image1 = getFileByFieldname(files, "image1");
    const image2 = getFileByFieldname(files, "image2");
    const image3 = getFileByFieldname(files, "image3");
    const points = parsePoints(body.points);
    const doc = await showcaseSectionModel.create({
      image1: image1 ? `${BASE_URL}/uploads/showcase/${image1.filename}` : "",
      image2: image2 ? `${BASE_URL}/uploads/showcase/${image2.filename}` : "",
      image3: image3 ? `${BASE_URL}/uploads/showcase/${image3.filename}` : "",
      heading: body.heading !== undefined ? String(body.heading) : undefined,
      paragraph: body.paragraph !== undefined ? String(body.paragraph) : undefined,
      ...(points !== undefined && { points }),
    });
    await revalidateNextjs({ tag: "home" });
    return res.status(201).json({ message: "Showcase section created.", success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Create showcase error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateShowcase = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const body = req.body as Record<string, unknown>;
    let doc = await showcaseSectionModel.findOne();
    if (!doc) doc = await showcaseSectionModel.create({});

    if (body.heading !== undefined) doc.heading = String(body.heading);
    if (body.paragraph !== undefined) doc.paragraph = String(body.paragraph);
    const points = parsePoints(body.points);
    if (points !== undefined) doc.points = points;

    const f1 = getFileByFieldname(files, "image1");
    const f2 = getFileByFieldname(files, "image2");
    const f3 = getFileByFieldname(files, "image3");
    if (f1) {
      deleteOldImage(doc.image1);
      doc.image1 = `${BASE_URL}/uploads/showcase/${f1.filename}`;
    }
    if (f2) {
      deleteOldImage(doc.image2);
      doc.image2 = `${BASE_URL}/uploads/showcase/${f2.filename}`;
    }
    if (f3) {
      deleteOldImage(doc.image3);
      doc.image3 = `${BASE_URL}/uploads/showcase/${f3.filename}`;
    }

    await doc.save();
    await revalidateNextjs({ tag: "home" });
    return res.status(200).json({ message: "Showcase section updated.", success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Update showcase error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import aboutPageModel from "../models/aboutPage.model";
import { revalidateNextjs } from "../utils/revalidate";

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

type AboutPageDoc = InstanceType<typeof aboutPageModel>;

function toResponse(doc: AboutPageDoc) {
  const data = doc.toObject() as unknown as Record<string, unknown>;
  data.sectionImage = toFullImageUrl(doc.sectionImage);
  return data;
}

export const getAboutPage = async (_req: Request, res: Response) => {
  try {
    let doc = await aboutPageModel.findOne();
    if (!doc) doc = await aboutPageModel.create({});
    return res.status(200).json({ success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Get about page error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createAboutPage = async (req: Request, res: Response) => {
  try {
    const existing = await aboutPageModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "About Page content already exists. Use PUT to update.",
        success: false,
      });
    }
    const body = req.body as Record<string, unknown>;
    const file = req.file;
    const sectionImage = file ? `${BASE_URL}/uploads/about/${file.filename}` : "";
    const s = (v: unknown): string => (typeof v === "string" ? v : v != null ? String(v) : "");
    const doc = await aboutPageModel.create({
      bannerHeading: s(body.bannerHeading) || "About Procure Export",
      bannerSubheading: s(body.bannerSubheading) || "We are a trusted import-export company committed to delivering high-quality products, transparent processes, and reliable global trade solutions.",
      sectionImage,
      sectionHeading: s(body.sectionHeading) || "About Procure Export",
      sectionContentParagraph1: s(body.sectionContentParagraph1) || "Procure Export connects global buyers with premium agricultural products, spices, and food grains. We focus on smart sourcing, quality assurance, and efficient logistics to make global trade simple and reliable.",
      sectionContentParagraph2: s(body.sectionContentParagraph2) || "Built on trust and transparency, we work closely with farmers, suppliers, and logistics partners to deliver products that meet international standards—on time, every time.",
      visionTitle: s(body.visionTitle) || "Vision",
      visionContent: s(body.visionContent) || "To redefine agricultural exports through innovation, quality, and global partnerships.",
      missionTitle: s(body.missionTitle) || "Mission",
      missionContent: s(body.missionContent) || "To provide reliable export solutions by sourcing the best products and delivering them efficiently to global markets.",
      ambitionTitle: s(body.ambitionTitle) || "Ambition",
      ambitionContent: s(body.ambitionContent) || "To rapidly expand our global export footprint, strengthen supplier networks, and position Procure Export as a preferred partner in international trade.",
    });
    await revalidateNextjs({ tag: "about" });
    return res.status(201).json({ message: "About Page created.", success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Create about page error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateAboutPage = async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, unknown>;
    const file = req.file;
    let doc = await aboutPageModel.findOne();
    if (!doc) doc = await aboutPageModel.create({});

    if (body.bannerHeading !== undefined) doc.bannerHeading = body.bannerHeading as string;
    if (body.bannerSubheading !== undefined) doc.bannerSubheading = body.bannerSubheading as string;
    if (body.sectionHeading !== undefined) doc.sectionHeading = body.sectionHeading as string;
    if (body.sectionContentParagraph1 !== undefined) doc.sectionContentParagraph1 = body.sectionContentParagraph1 as string;
    if (body.sectionContentParagraph2 !== undefined) doc.sectionContentParagraph2 = body.sectionContentParagraph2 as string;
    if (body.visionTitle !== undefined) doc.visionTitle = body.visionTitle as string;
    if (body.visionContent !== undefined) doc.visionContent = body.visionContent as string;
    if (body.missionTitle !== undefined) doc.missionTitle = body.missionTitle as string;
    if (body.missionContent !== undefined) doc.missionContent = body.missionContent as string;
    if (body.ambitionTitle !== undefined) doc.ambitionTitle = body.ambitionTitle as string;
    if (body.ambitionContent !== undefined) doc.ambitionContent = body.ambitionContent as string;

    if (file) {
      if (doc.sectionImage) {
        const filename = getStoredFilename(doc.sectionImage);
        if (filename) {
          const oldPath = path.join(UPLOAD_DIR, filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      doc.sectionImage = `${BASE_URL}/uploads/about/${file.filename}`;
    }
    await doc.save();
    await revalidateNextjs({ tag: "about" });
    return res.status(200).json({ message: "About Page updated successfully.", success: true, data: toResponse(doc) });
  } catch (err) {
    console.error("Update about page error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

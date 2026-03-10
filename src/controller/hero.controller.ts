import { Request, Response } from "express";
import heroModel from "../models/hero.model";
import path from "path";
import fs from "fs";
import { revalidateNextjs } from "../utils/revalidate";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "hero");
const BASE_URL = (process.env.BASE_URL || "http://localhost:5020").replace(/\/$/, "");

function toFullImageUrl(heroImage: string): string {
  if (!heroImage) return "";
  if (heroImage.startsWith("http://") || heroImage.startsWith("https://")) return heroImage;
  return `${BASE_URL}${heroImage.startsWith("/") ? "" : "/"}${heroImage}`;
}

function getStoredFilename(heroImage: string): string {
  return path.basename(heroImage.split("/").pop() || "");
}

export const getHero = async (_req: Request, res: Response) => {
  try {
    let hero = await heroModel.findOne();
    if (!hero) {
      hero = await heroModel.create({});
    }
    const data = hero.toObject();
    data.heroImage = toFullImageUrl(hero.heroImage);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get hero error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

function parseTags(tags: string | string[] | undefined, current: string[]): string[] {
  if (tags === undefined) return current;
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      return JSON.parse(tags) as string[];
    } catch {
      return tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
  }
  return current;
}

export const createHero = async (req: Request, res: Response) => {
  try {
    const existing = await heroModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "Hero section already exists. Use PUT /api/hero to update.",
        success: false,
      });
    }
    const { heading, subheading, tags } = req.body;
    const file = req.file;
    let heroImage = "";
    if (file) {
      heroImage = `${BASE_URL}/uploads/hero/${file.filename}`;
    }
    const hero = await heroModel.create({
      heroImage,
      heading: heading ?? "PREMIUM SEEDS\nFOR GLOBAL AGRICULTURE",
      subheading: subheading ?? "Import export of speciality finest quality agricultural and food products",
      tags: parseTags(tags, ["#Import", "#Relaibleshipping", "#Bestproducts", "#Export"]),
    });
    const data = hero.toObject();
    data.heroImage = toFullImageUrl(hero.heroImage);
    await revalidateNextjs({ tag: "home" });
    return res.status(201).json({ message: "Hero section created.", success: true, data });
  } catch (err) {
    console.error("Create hero error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateHero = async (req: Request, res: Response) => {
  try {
    const { heading, subheading, tags } = req.body;
    const file = req.file;

    let hero = await heroModel.findOne();
    if (!hero) {
      hero = await heroModel.create({});
    }

    if (heading !== undefined) hero.heading = heading;
    if (subheading !== undefined) hero.subheading = subheading;
    hero.tags = parseTags(tags, hero.tags);

    if (file) {
      if (hero.heroImage) {
        const filename = getStoredFilename(hero.heroImage);
        if (filename) {
          const oldPath = path.join(UPLOAD_DIR, filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      hero.heroImage = `${BASE_URL}/uploads/hero/${file.filename}`;
    }

    await hero.save();
    await revalidateNextjs({ tag: "home" });
    const data = hero.toObject();
    data.heroImage = toFullImageUrl(hero.heroImage);
    return res.status(200).json({ message: "Hero updated successfully.", success: true, data });
  } catch (err) {
    console.error("Update hero error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

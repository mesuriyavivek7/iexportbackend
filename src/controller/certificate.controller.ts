import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import certificateModel from "../models/certificate.model";
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "certificates");
const BASE_URL = (process.env.BASE_URL || "http://localhost:5020").replace(/\/$/, "");

function toFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

function getStoredFilename(imageUrl: string): string {
  return path.basename(imageUrl.split("/").pop() || "");
}

export const getCertificates = async (_req: Request, res: Response) => {
  try {
    const certificates = await certificateModel.find().sort({ createdAt: -1 }).lean();
    const data = certificates.map((c) => ({
      ...c,
      image: toFullImageUrl(c.image),
    }));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Get certificates error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Certificate image is required.", success: false });
    const image = `${BASE_URL}/uploads/certificates/${file.filename}`;
    const certificate = await certificateModel.create({ image });
    const data = { ...certificate.toObject(), image: toFullImageUrl(certificate.image) };
    return res.status(201).json({ message: "Certificate added.", success: true, data });
  } catch (err) {
    console.error("Create certificate error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await certificateModel.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: "Certificate not found", success: false });
    if (certificate.image) {
      const filename = getStoredFilename(certificate.image);
      if (filename) {
        const filePath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
    await certificateModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Certificate deleted.", success: true });
  } catch (err) {
    console.error("Delete certificate error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

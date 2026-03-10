import { Request, Response } from "express";
import contactUsModel from "../models/contactUs.model";
import { revalidateNextjs } from "../utils/revalidate";

function parseContactPersons(value: unknown): { name: string; mobileNo: string }[] | undefined {
  if (!Array.isArray(value) || value.length < 2) return undefined;
  return value.slice(0, 2).map((item) => {
    const o = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return {
      name: String(o.name ?? ""),
      mobileNo: String(o.mobileNo ?? ""),
    };
  });
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

function parseSocialLinks(value: unknown): { instagram: string; linkedin: string; facebook: string } | undefined {
  if (!value || typeof value !== "object") return undefined;
  const o = value as Record<string, unknown>;
  return {
    instagram: String(o.instagram ?? ""),
    linkedin: String(o.linkedin ?? ""),
    facebook: String(o.facebook ?? ""),
  };
}

export const getContactUs = async (_req: Request, res: Response) => {
  try {
    let doc = await contactUsModel.findOne();
    if (!doc) doc = await contactUsModel.create({});
    return res.status(200).json({ success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Get contact us error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createContactUs = async (req: Request, res: Response) => {
  try {
    const existing = await contactUsModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "Contact Us section already created. Use PUT /api/contact-us to update.",
        success: false,
      });
    }
    const body = req.body as Record<string, unknown>;
    const contactPersons = parseContactPersons(body.contactPersons);
    const points = parsePoints(body.points);
    const socialLinks = parseSocialLinks(body.socialLinks);
    const doc = await contactUsModel.create({
      ...(contactPersons && { contactPersons }),
      ...(body.email !== undefined && { email: String(body.email) }),
      ...(points && { points }),
      ...(socialLinks && { socialLinks }),
    });
    await revalidateNextjs({ tag: "contact" });
    return res.status(201).json({ message: "Contact Us section created.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Create contact us error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateContactUs = async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, unknown>;
    let doc = await contactUsModel.findOne();
    if (!doc) doc = await contactUsModel.create({});

    const contactPersons = parseContactPersons(body.contactPersons);
    if (contactPersons) doc.contactPersons = contactPersons;
    if (body.email !== undefined) doc.email = String(body.email);
    const points = parsePoints(body.points);
    if (points !== undefined) doc.points = points;
    const socialLinks = parseSocialLinks(body.socialLinks);
    if (socialLinks) doc.socialLinks = socialLinks;

    await doc.save();
    await revalidateNextjs({ tag: "contact" });
    return res.status(200).json({ message: "Contact Us section updated.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Update contact us error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

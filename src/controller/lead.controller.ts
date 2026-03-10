import { Request, Response } from "express";
import leadModel from "../models/lead.model";

export const getLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await leadModel.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: leads });
  } catch (err) {
    console.error("Get leads error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const nameStr = name != null ? String(name).trim() : "";
    const emailStr = email != null ? String(email).trim().toLowerCase() : "";
    const messageStr = message != null ? String(message).trim() : "";

    if (!nameStr) return res.status(400).json({ message: "Name is required.", success: false });
    if (!emailStr) return res.status(400).json({ message: "Email is required.", success: false });
    if (!messageStr) return res.status(400).json({ message: "Message is required.", success: false });

    const lead = await leadModel.create({ name: nameStr, email: emailStr, message: messageStr });
    return res.status(201).json({
      message: "Inquiry submitted successfully. We'll get back to you shortly.",
      success: true,
      data: lead.toObject(),
    });
  } catch (err) {
    console.error("Create lead error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

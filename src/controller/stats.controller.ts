import { Request, Response } from "express";
import statsSectionModel from "../models/statsSection.model";
import { revalidateNextjs } from "../utils/revalidate";

export const getStats = async (_req: Request, res: Response) => {
  try {
    let doc = await statsSectionModel.findOne();
    if (!doc) doc = await statsSectionModel.create({});
    return res.status(200).json({ success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Get stats error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createStats = async (req: Request, res: Response) => {
  try {
    const existing = await statsSectionModel.findOne();
    if (existing) {
      return res.status(400).json({
        message: "Stats section already created. Use PUT /api/stats to update.",
        success: false,
      });
    }
    const { stats } = req.body;
    const doc = await statsSectionModel.create(
      stats !== undefined && Array.isArray(stats)
        ? {
            stats: stats.map((s: { count?: string; title?: string }) => ({
              count: String(s?.count ?? ""),
              title: String(s?.title ?? ""),
            })),
          }
        : {}
    );
    await revalidateNextjs({ tag: "home" });
    return res.status(201).json({ message: "Stats section created.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Create stats error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateStats = async (req: Request, res: Response) => {
  try {
    const { stats } = req.body;
    let doc = await statsSectionModel.findOne();
    if (!doc) doc = await statsSectionModel.create({});

    if (stats !== undefined && Array.isArray(stats)) {
      doc.stats = stats.map((s: { count?: string; title?: string }) => ({
        count: String(s?.count ?? ""),
        title: String(s?.title ?? ""),
      }));
    }
    await doc.save();
    await revalidateNextjs({ tag: "home" });
    return res.status(200).json({ message: "Stats section updated.", success: true, data: doc.toObject() });
  } catch (err) {
    console.error("Update stats error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

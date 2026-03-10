import mongoose, { Document, Schema } from "mongoose";

export interface IAboutPage extends Document {
  bannerHeading: string;
  bannerSubheading: string;
  sectionImage: string;
  sectionHeading: string;
  sectionContentParagraph1: string;
  sectionContentParagraph2: string;
  visionTitle: string;
  visionContent: string;
  missionTitle: string;
  missionContent: string;
  ambitionTitle: string;
  ambitionContent: string;
}

const aboutPageSchema: Schema<IAboutPage> = new mongoose.Schema(
  {
    bannerHeading: { type: String, default: "About Procure Export" },
    bannerSubheading: {
      type: String,
      default:
        "We are a trusted import-export company committed to delivering high-quality products, transparent processes, and reliable global trade solutions.",
    },
    sectionImage: { type: String, default: "" },
    sectionHeading: { type: String, default: "About Procure Export" },
    sectionContentParagraph1: {
      type: String,
      default:
        "Procure Export connects global buyers with premium agricultural products, spices, and food grains. We focus on smart sourcing, quality assurance, and efficient logistics to make global trade simple and reliable.",
    },
    sectionContentParagraph2: {
      type: String,
      default:
        "Built on trust and transparency, we work closely with farmers, suppliers, and logistics partners to deliver products that meet international standards—on time, every time.",
    },
    visionTitle: { type: String, default: "Vision" },
    visionContent: {
      type: String,
      default:
        "To redefine agricultural exports through innovation, quality, and global partnerships.",
    },
    missionTitle: { type: String, default: "Mission" },
    missionContent: {
      type: String,
      default:
        "To provide reliable export solutions by sourcing the best products and delivering them efficiently to global markets.",
    },
    ambitionTitle: { type: String, default: "Ambition" },
    ambitionContent: {
      type: String,
      default:
        "To rapidly expand our global export footprint, strengthen supplier networks, and position Procure Export as a preferred partner in international trade.",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAboutPage>("AboutPage", aboutPageSchema);

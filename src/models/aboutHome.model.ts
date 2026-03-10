import mongoose, { Document, Schema } from "mongoose";

export interface IAboutHome extends Document {
  aboutImage: string;
  heading: string;
  subheading: string;
  contentParagraph1: string;
  contentParagraph2: string;
}

const aboutHomeSchema: Schema<IAboutHome> = new mongoose.Schema(
  {
    aboutImage: { type: String, default: "" },
    heading: {
      type: String,
      default: "Your Trusted Partner in International Trade.",
    },
    subheading: {
      type: String,
      default: "ABOUT PROCURE EXPORT",
    },
    contentParagraph1: {
      type: String,
      default:
        "Welcome to Procure Exports, your trusted partner in delivering the finest quality agricultural and food products to markets worldwide. With a passion for excellence and a commitment to global trade, we specialize in the export of premium fruits and vegetables, authentic spices, aromatic coffee, and high-grade rice.",
    },
    contentParagraph2: {
      type: String,
      default:
        "At Procure Exports, we believe in connecting cultures through the richness of food and agriculture. Our carefully sourced products are cultivated with care, meeting the highest standards of quality and freshness. Whether it's the vibrant flavors of fresh produce, the bold aroma of our spices, the rich taste of coffee, or the superior quality of our rice, we ensure every product reflects our dedication to excellence.",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAboutHome>("AboutHome", aboutHomeSchema);

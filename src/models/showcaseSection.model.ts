import mongoose, { Document, Schema } from "mongoose";

export interface IShowcaseSection extends Document {
  image1: string; // vertical
  image2: string; // horizontal
  image3: string; // horizontal
  heading: string;
  paragraph: string;
  points: string[];
}

const showcaseSectionSchema: Schema<IShowcaseSection> = new mongoose.Schema(
  {
    image1: { type: String, default: "" },
    image2: { type: String, default: "" },
    image3: { type: String, default: "" },
    heading: {
      type: String,
      default: "Excellence in Every Trade, Trust in Every Deal",
    },
    paragraph: {
      type: String,
      default:
        "Partner with us for unmatched quality and a commitment to delivering the best from nature to your doorstep, ensuring satisfaction and excellence every time.",
    },
    points: {
      type: [String],
      default: [
        "Uncompromising Quality",
        "Customer-Focused Solutions",
        "Ethical & Sustainable Practices",
        "Performance Guaranteed",
        "On-Time Global Deliveries",
        "Trusted Worldwide Network",
        "Competitive Pricing Options",
        "Expert Team Support",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IShowcaseSection>("ShowcaseSection", showcaseSectionSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface ICategorySection extends Document {
  heading: string;
  subheading: string;
}

const categorySectionSchema: Schema<ICategorySection> = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Crafted by Nature, Delivered with Care",
    },
    subheading: {
      type: String,
      default:
        "Experience the finest products, sourced responsibly and delivered with uncompromising quality.",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategorySection>("CategorySection", categorySectionSchema);

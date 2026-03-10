import mongoose, { Document, Schema } from "mongoose";

export interface ICategoriesPage extends Document {
  heading: string;
  subheading: string;
}

const categoriesPageSchema: Schema<ICategoriesPage> = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Our Categories",
    },
    subheading: {
      type: String,
      default: "Browse our range of premium products by category.",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategoriesPage>("CategoriesPage", categoriesPageSchema);

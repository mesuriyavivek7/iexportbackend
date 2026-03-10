import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  image: string;
  category: mongoose.Types.ObjectId;
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);

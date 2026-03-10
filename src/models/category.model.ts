import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: string;
}

const categorySchema: Schema<ICategory> = new mongoose.Schema(
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
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);

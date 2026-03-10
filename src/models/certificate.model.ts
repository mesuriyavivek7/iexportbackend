import mongoose, { Document, Schema } from "mongoose";

export interface ICertificate extends Document {
  image: string;
}

const certificateSchema: Schema<ICertificate> = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICertificate>("Certificate", certificateSchema);

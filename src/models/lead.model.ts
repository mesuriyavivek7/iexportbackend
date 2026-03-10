import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  message: string;
}

const leadSchema: Schema<ILead> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>("Lead", leadSchema);

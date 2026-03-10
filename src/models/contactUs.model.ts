import mongoose, { Document, Schema } from "mongoose";

export interface IContactPerson {
  name: string;
  mobileNo: string;
}

export interface ISocialLinks {
  instagram: string;
  linkedin: string;
  facebook: string;
}

export interface IContactUs extends Document {
  contactPersons: IContactPerson[];
  email: string;
  points: string[];
  socialLinks: ISocialLinks;
}

const contactPersonSchema = new Schema<IContactPerson>(
  {
    name: { type: String, default: "" },
    mobileNo: { type: String, default: "" },
  },
  { _id: false }
);

const socialLinksSchema = new Schema<ISocialLinks>(
  {
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
  },
  { _id: false }
);

const contactUsSchema: Schema<IContactUs> = new mongoose.Schema(
  {
    contactPersons: {
      type: [contactPersonSchema],
      default: [
        { name: "Patel Jainish", mobileNo: "+91 6355007570" },
        { name: "Patel Yagnik", mobileNo: "+91 9925867065" },
      ],
    },
    email: {
      type: String,
      default: "procureexport24@gmail.com",
    },
    points: {
      type: [String],
      default: [
        "Source high-quality sand and seeds from trusted suppliers",
        "Ensure timely global shipping with end-to-end logistics support",
        "Get competitive pricing for bulk and long-term orders",
        "Rely on quality checks, documentation, and compliance handling",
      ],
    },
    socialLinks: {
      type: socialLinksSchema,
      default: {
        instagram: "",
        linkedin: "",
        facebook: "",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IContactUs>("ContactUs", contactUsSchema);

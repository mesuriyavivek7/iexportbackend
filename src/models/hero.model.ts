import mongoose, { Document, Schema } from "mongoose";

export interface IHero extends Document {
  heroImage: string;
  heading: string;
  subheading: string;
  tags: string[];
}

const heroSchema: Schema<IHero> = new mongoose.Schema(
  {
    heroImage: {
      type: String,
      default: "",
    },
    heading: {
      type: String,
      default: "PREMIUM SEEDS\nFOR GLOBAL AGRICULTURE",
    },
    subheading: {
      type: String,
      default: "Import export of speciality finest quality agricultural and food products",
    },
    tags: {
      type: [String],
      default: ["#Import", "#Relaibleshipping", "#Bestproducts", "#Export"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IHero>("Hero", heroSchema);

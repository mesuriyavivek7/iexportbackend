import mongoose, { Document, Schema } from "mongoose";

export interface IStatItem {
  count: string;
  title: string;
}

export interface IStatsSection extends Document {
  stats: IStatItem[];
}

const statItemSchema = new Schema<IStatItem>(
  {
    count: { type: String, default: "4+" },
    title: { type: String, default: "Years of Experience" },
  },
  { _id: false }
);

const statsSectionSchema: Schema<IStatsSection> = new mongoose.Schema(
  {
    stats: {
      type: [statItemSchema],
      default: [
        { count: "4+", title: "Years of Experience" },
        { count: "85+", title: "Consignment Done" },
        { count: "120+", title: "Happy Buyers" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IStatsSection>("StatsSection", statsSectionSchema);

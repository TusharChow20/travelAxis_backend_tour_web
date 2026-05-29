import mongoose, { Schema } from "mongoose";
import { ITourDuration } from "./tourDuration.interface";

const tourDurationSchema = new Schema<ITourDuration>(
  { name: { type: String, required: true, unique: true } },
  { timestamps: true },
);
export const TourDuration = mongoose.model<ITourDuration>(
  "TourDuration",
  tourDurationSchema,
);

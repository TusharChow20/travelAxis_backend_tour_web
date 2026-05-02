import { model, Schema } from "mongoose";
import { ITourDuration } from "./tourDuration.interface";

const tourDurationSchema = new Schema<ITourDuration>(
  { name: { type: String, required: true, unique: true } },
  { timestamps: true },
);

export const TourDuration = model<ITourDuration>(
  "TourDuration",
  tourDurationSchema,
);

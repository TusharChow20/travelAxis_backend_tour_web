import { model, Schema } from "mongoose";
import { ITour, ITourDuration } from "./tour.interface";

const tourDurationSchema = new Schema<ITourDuration>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export const TourDuration = model<ITourDuration>(
  "TourDuration",
  tourDurationSchema,
);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },

    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxPeople: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourDuration: {
      type: Schema.Types.ObjectId,
      ref: "TourDuration",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Tour = model<ITour>("Tour", tourSchema);

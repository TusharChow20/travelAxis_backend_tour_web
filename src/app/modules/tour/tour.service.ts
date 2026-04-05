import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: Partial<ITour>) => {
  const { slug, title, ...rest } = payload;
  if (!slug) {
    throw new Error("Slug is required");
  }
  if (!title) {
    throw new Error("title is required");
  }

  const tourExists = await Tour.findOne({ title });

  if (tourExists) {
    throw new Error("Tour already exists");
  }
  const tour = await Tour.create(payload);
  return tour;
};

// const getAllTours = async(payload)

export const TourService = {
  createTour,
};

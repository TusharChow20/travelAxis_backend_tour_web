import { TourDuration } from "./tourDuration.model";
import { ITourDuration } from "./tourDuration.interface";

const createTourDuration = async (payload: ITourDuration) => {
  const exists = await TourDuration.findOne({ name: payload.name });
  if (exists) throw new Error("Tour duration already exists");
  return await TourDuration.create(payload);
};

const getAllTourDurations = async () => {
  return await TourDuration.find({}).sort({ createdAt: -1 });
};

const deleteTourDuration = async (id: string) => {
  const duration = await TourDuration.findById(id);
  if (!duration) throw new Error("Tour duration not found");
  await TourDuration.findByIdAndDelete(id);
  return null;
};

export const TourDurationService = {
  createTourDuration,
  getAllTourDurations,
  deleteTourDuration,
};
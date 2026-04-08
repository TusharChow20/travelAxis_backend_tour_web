import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: Partial<ITour>) => {
  const { title, ...rest } = payload;
  if (!title) {
    throw new Error("title is required");
  }

  const baseSlug = title.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }

  payload.slug = slug;

  const tourExists = await Tour.findOne({ title });

  if (tourExists) {
    throw new Error("Tour already exists");
  }
  const tour = await Tour.create(payload);
  return tour;
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }
  if (payload.title) {
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    payload.slug = slug;
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updatedTour;
};
const getAllTours = async (query: Record<string, string>) => {
  const tourFields = ["title", "description", "location"];
  const searchTerms = query.searchTerm || "";
  delete query["searchTerm"];

  const searchArray = tourFields.map((field) => ({
    [field]: { $regex: searchTerms, $options: "i" },
  }));
  const allTour = await Tour.find({
    $or: searchArray,
  } as any).find(query);

  const totalTours = await Tour.countDocuments();
  return {
    data: allTour,

    meta: {
      total: totalTours,
    },
  };
};

export const TourService = {
  createTour,
  updateTour,
  getAllTours,
};

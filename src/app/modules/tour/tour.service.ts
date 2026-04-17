import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";
import { QueryBuilder } from "../../utils/QueryBuilderClass";
import { deleteImagesFromCloud } from "../../config/cloudinary.config";

const createTour = async (payload: Partial<ITour>) => {
  const { title, ...rest } = payload;
  if (!title) throw new Error("title is required");

  const baseSlug = title.toLowerCase().split(" ").join("-");
  let slug = baseSlug;
  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  payload.slug = slug;

  const tourExists = await Tour.findOne({ title });
  if (tourExists) throw new Error("Tour already exists");

  return await Tour.create(payload);
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) throw new Error("Tour not found.");

  if (payload.title) {
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = baseSlug;
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    payload.slug = slug;
  }
  if (payload.images?.length && existingTour.images?.length) {
    await deleteImagesFromCloud(existingTour.images);
  }

  return await Tour.findByIdAndUpdate(id, payload, { new: true });
};

const deleteTour = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour) throw new Error("Tour not found.");

  if (tour.images?.length) {
    await deleteImagesFromCloud(tour.images);
  }

  await Tour.findByIdAndDelete(id);
  return null;
};

const getAllTours = async (query: Record<string, string>) => {
  const tourFields = ["title", "description", "location"];
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const [allTour, meta] = await Promise.all([
    queryBuilder
      .search(tourFields)
      .filter()
      .sort()
      .fields()
      .pagination()
      .build(),
    queryBuilder.getMeta(),
  ]);

  return { data: allTour, meta };
};

export const TourService = {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
};

import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";
import { QueryBuilder } from "../../utils/QueryBuilderClass";

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

  return {
    data: allTour,
    meta,
  };
};

export const TourService = {
  createTour,
  updateTour,
  getAllTours,
};

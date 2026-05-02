import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";
import { QueryBuilder } from "../../utils/QueryBuilderClass";
import { deleteImagesFromCloud } from "../../config/cloudinary.config";
import { Division } from "../division/division.model";
import Fuse from "fuse.js";

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

const getTourSuggestions = async (searchTerm: string) => {
  if (!searchTerm || searchTerm.length < 2) return [];

  const tours = await Tour.find({})
    .populate("division", "name")
    .select("title location division slug")
    .limit(100)
    .lean();

  // ✅ Flatten data for fuse
  const searchData = tours.map((tour: any) => ({
    _id: tour._id,
    title: tour.title,
    location: tour.location || "",
    division: tour.division?.name || "",
    slug: tour.slug,
    type: "tour",
  }));

  // ✅ Also get divisions
  const divisions = await Division.find({}).select("name slug").lean();

  const divisionData = divisions.map((div: any) => ({
    _id: div._id,
    title: div.name,
    location: "",
    division: div.name,
    slug: div.slug,
    type: "division",
  }));

  const allData = [...searchData, ...divisionData];

  // ✅ Fuse.js fuzzy search config
  const fuse = new Fuse(allData, {
    keys: ["title", "location", "division"],
    threshold: 0.4, // 0 = exact, 1 = match anything
    distance: 100, // how far to search
    minMatchCharLength: 2,
    includeScore: true,
  });

  const results = fuse.search(searchTerm).slice(0, 8);

  return results.map((r) => r.item);
};

export const TourService = {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTourSuggestions,
};

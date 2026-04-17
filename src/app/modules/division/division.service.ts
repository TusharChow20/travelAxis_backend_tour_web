import { deleteImageFromCloud } from "../../config/cloudinary.config";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const { name, ...rest } = payload;
  if (!name) throw new Error("Name is required");
  const slug = `${name.toLowerCase().split(" ").join("-")}-division`;

  const divisionExists = await Division.findOne({ name });
  if (divisionExists) {
    throw new Error("Division already exists");
  }
  const division = await Division.create({
    name,
    slug,
    ...rest,
  });
  return division;
};
const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments();
  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Division.findById(id);
  if (!existingDivision) {
    throw new Error("Division not found");
  }

  if (payload.name) {
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${baseSlug}-division-${counter++}`;
    }

    payload.slug = slug;

    const duplicateDivision = await Division.findOne({
      name: payload.name,
      _id: { $ne: id },
    });
    if (duplicateDivision) {
      throw new Error("Division already exists.");
    }
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (payload.thumbnail && existingDivision.thumbnail) {
    await deleteImageFromCloud(existingDivision.thumbnail);
  }

  return updatedDivision;
};
const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division) throw new Error("Division not found");

  if (division.thumbnail) {
    await deleteImageFromCloud(division.thumbnail);
  }
  return {
    data: division,
  };
};

export const DivisionService = {
  createDivision,
  deleteDivision,
  updateDivision,
  getAllDivisions,
  getSingleDivision,
};

import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const { name, slug, ...rest } = payload;
  if (!name) throw new Error("Name is required");
  if (!slug) throw new Error("Slug is required");
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
    const duplicateDivision = await Division.findOne({
      name: payload.name,
      _id: { $ne: id },
    });
    if (duplicateDivision) {
      throw new Error("A division with this name already exists.");
    }
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedDivision;
};
const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};
export const DivisionService = {
  createDivision,
  deleteDivision,
  updateDivision,
  getAllDivisions,
};

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

export const DivisionService = {
  createDivision,
};

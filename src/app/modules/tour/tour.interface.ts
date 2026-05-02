import { Types } from "mongoose";

export interface ITour {
  slug: string;
  title: string;
  description?: string;
  images?: string[];
  location?: string;
  costFrom?: number;
  tourType?: string;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxPeople: number;
  minAge?: number;
  departureLocation?: string;
  arrivalLocation?: string;
  division: Types.ObjectId;
  tourDuration: Types.ObjectId;
}

export interface ITourDuration {
  name: string;
}

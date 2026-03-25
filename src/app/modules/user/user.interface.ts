import { Types } from "mongoose";

export interface IAuthProvider {
  provider_name: string;
  provider_id: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  role: "SUPER_ADMIN"|"USER" | "ADMIN" | "GUIDE";

  auths: IAuthProvider[];
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  bookings: Types.ObjectId[];
  guides?: Types.ObjectId[];
}

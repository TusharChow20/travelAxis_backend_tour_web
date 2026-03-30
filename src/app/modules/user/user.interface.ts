import { Types } from "mongoose";

export interface IAuthProvider {
  provider_name: "credentials" | "google";
  provider_id: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
  ADMIN = "ADMIN",
  GUIDE = "GUIDE",
}

export interface IUser {
  name: string;
  email: string;
  role: Role;

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

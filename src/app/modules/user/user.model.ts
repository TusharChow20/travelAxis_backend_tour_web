import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser } from "./user.interface";
import { boolean } from "zod";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider_name: { type: String, required: true },
    provider_id: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "USER", "ADMIN", "GUIDE"],
      default: "USER",
    } as any,
    phone: { type: String },
    address: { type: String },
    picture: { type: String },
    isDeleted: { type: boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("User", userSchema);

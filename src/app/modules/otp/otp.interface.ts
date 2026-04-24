import { Types } from "mongoose";

export interface IOtp {
  userId: Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
  isUsed: boolean;
}
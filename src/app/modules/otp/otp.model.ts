import { model, Schema } from "mongoose";
import { IOtp } from "./otp.interface";

const otpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Auto delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>("Otp", otpSchema);

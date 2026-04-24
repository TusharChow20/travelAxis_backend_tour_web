import bcryptjs from "bcryptjs";
import { User } from "../user/user.model";
import { Otp } from "./otp.model";
import varEnv from "../../config/env";
import { sendMail } from "../../utils/seendEmail";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Invalidate previous OTPs
  await Otp.updateMany({ email, isUsed: false }, { isUsed: true });

  const otp = generateOtp();
  const hashedOtp = await bcryptjs.hash(otp, 10);

  await Otp.create({
    userId: user._id,
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
  });

  await sendMail({
    to: email,
    subject: "Your OTP Code",
    template: "otpEmail",
    templateData: {
      name: user.name,
      otp,
      expiresIn: "5 minutes",
    },
  });

  return { message: "OTP sent successfully" };
};

const verifyOtp = async (email: string, otp: string) => {
  const otpRecord = await Otp.findOne({
    email,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 }); 

  if (!otpRecord) throw new Error("OTP expired or not found");

  const isMatch = await bcryptjs.compare(otp, otpRecord.otp);
  if (!isMatch) throw new Error("Invalid OTP");

  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  // Mark user as verified
  await User.findByIdAndUpdate(otpRecord.userId, { isVerified: true });

  return { message: "OTP verified successfully" };
};

export const OtpService = {
  sendOtp,
  verifyOtp,
};

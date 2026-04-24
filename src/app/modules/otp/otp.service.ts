import bcryptjs from "bcryptjs";
import { User } from "../user/user.model";
import redisClient from "../../config/redis.config";
import { sendMail } from "../../utils/seendEmail";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.isVerified == true) {
    throw new Error("You are already verified");
  }
  const otp = generateOtp();
  const hashedOtp = await bcryptjs.hash(otp, 10);

  //Store hashed OTP in Redis with 5 min expiry
  await redisClient.set(`otp:${email}`, hashedOtp, { EX: 300 });

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
  const hashedOtp = await redisClient.get(`otp:${email}`);
  if (!hashedOtp) throw new Error("OTP expired or not found");

  const isMatch = await bcryptjs.compare(otp, hashedOtp);
  if (!isMatch) throw new Error("Invalid OTP");

  await redisClient.del(`otp:${email}`);

  await User.findOneAndUpdate({ email }, { isVerified: true });

  return { message: "OTP verified successfully" };
};

export const OtpService = {
  sendOtp,
  verifyOtp,
};

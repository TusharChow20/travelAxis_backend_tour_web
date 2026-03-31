import varEnv from "../../config/env";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const loginCredentials = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (!varEnv.JWT_ACCESS_SECRET || !varEnv.JWT_ACCESS_EXPIRES) {
    throw new Error("JWT environment variables are not configured");
  }
  const userExists = await User.findOne({ email });
  if (!userExists) {
    throw new Error("User not exists");
  }
  const passwordMatched = await bcrypt.compare(
    password as string,
    userExists.password as string,
  );
  if (!passwordMatched) {
    throw new Error("Incorrect Password Try Again!");
  }

  const accessToken = generateToken(
    {
      userId: userExists._id,
      email: userExists.email,
      role: userExists.role,
    },
    varEnv.JWT_ACCESS_SECRET as string,
    varEnv.JWT_ACCESS_EXPIRES as string,
  );

  return {
    // email: userExists.email,
    accessToken,
  };
};

export const authServices = {
  loginCredentials,
};

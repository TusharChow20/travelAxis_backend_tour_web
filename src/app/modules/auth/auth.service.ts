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
  const jwtPayload = {
    userId: userExists._id,
    email: userExists.email,
    role: userExists.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    varEnv.JWT_ACCESS_SECRET as string,
    varEnv.JWT_ACCESS_EXPIRES as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    varEnv.REFRESH_TOKEN_SECRET as string,
    varEnv.REFRESH_TOKEN_EXPIRE as string,
  );

  const { password: pass, ...rest } = userExists.toObject();

  return {
    // email: userExists.email,
    accessToken,
    refreshToken,
    user: rest,
  };
};

export const authServices = {
  loginCredentials,
};

import varEnv from "../../config/env";
import { generateToken, verifyToken } from "../../utils/jwt";
import { userToken } from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
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
  const userTokens = userToken(userExists);

  const { password: pass, ...rest } = userExists.toObject();

  return {
    // email: userExists.email,
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const verifyRefreshToken = verifyToken(refreshToken,varEnv.REFRESH_TOKEN_SECRET as string) as JwtPayload

  const userExists = await User.findOne({ email: verifyRefreshToken.email });
  if (!userExists) {
    throw new Error("User not exists");
  }
  const userTokens = userToken(userExists);

  return {
    accessToken: userTokens.accessToken,
  };
};

export const authServices = {
  loginCredentials,
  getNewAccessToken
};

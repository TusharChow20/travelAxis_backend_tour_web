import { JwtPayload } from "jsonwebtoken";
import varEnv from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";

export const userToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
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

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken =async (refreshToken: string) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    varEnv.REFRESH_TOKEN_SECRET as string,
  ) as JwtPayload;

  const userExists = await User.findOne({ email: verifyRefreshToken.email });
  if (!userExists) {
    throw new Error("User not exists");
  }
  const userTokens = userToken(userExists);

  return {
    accessToken: userTokens.accessToken,
  };
};

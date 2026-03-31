import varEnv from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

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

    accessToken, refreshToken
  }
};

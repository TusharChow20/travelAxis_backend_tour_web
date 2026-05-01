import varEnv from "../../config/env";
import { generateToken, verifyToken } from "../../utils/jwt";
import { sendMail } from "../../utils/seendEmail";
import {
  createNewAccessTokenWithRefreshToken,
  userToken,
} from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

const loginCredentials = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  if (!email || !password) throw new Error("Email and password are required");
  if (!varEnv.JWT_ACCESS_SECRET || !varEnv.JWT_ACCESS_EXPIRES)
    throw new Error("JWT environment variables are not configured");

  const userExists = await User.findOne({ email });
  if (!userExists) throw new Error("User not exists");

  const passwordMatched = await bcryptjs.compare(
    password as string,
    userExists.password as string,
  );

  if (!passwordMatched) throw new Error("Incorrect Password Try Again!");
  if (!userExists.isVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }
  const userTokens = userToken(userExists);
  const { password: pass, ...rest } = userExists.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithRefreshToken(refreshToken);
  return newAccessToken;
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) throw new Error("User not found");

  const matchOldPass = await bcryptjs.compare(
    oldPassword,
    user.password as string,
  );
  if (!matchOldPass) throw new Error("Password wrong");

  user.password = await bcryptjs.hash(
    newPassword,
    Number(varEnv.BCRYPT_SALT_ROUND),
  );
  await user.save();
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) throw new Error("User not found");

  const matchOldPass = await bcryptjs.compare(
    oldPassword,
    user.password as string,
  );
  if (!matchOldPass) throw new Error("Password wrong");

  user.password = await bcryptjs.hash(
    newPassword,
    Number(varEnv.BCRYPT_SALT_ROUND),
  );
  await user.save();
};

const setPassword = async (userId: string, password: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.password)
    throw new Error("Password already set. Use change-password instead.");

  user.password = await bcryptjs.hash(
    password,
    Number(varEnv.BCRYPT_SALT_ROUND),
  );
  await user.save();
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const resetToken = generateToken(
    { userId: user._id, email: user.email },
    varEnv.JWT_ACCESS_SECRET as string,
    "10m",
  );

  await sendMail({
    to: email,
    subject: "Password Reset Request",
    template: "forgetPassword",
    templateData: {
      name: user.name,
      resetLink: `${varEnv.FRONTEND_URL}/reset-password?token=${resetToken}`,
    },
  });

  return { message: "Reset email sent successfully" };
};

const resetPasswordWithToken = async (token: string, newPassword: string) => {
  const decoded = verifyToken(
    token,
    varEnv.JWT_ACCESS_SECRET as string,
  ) as JwtPayload;
  if (!decoded?.userId) throw new Error("Invalid or expired token");

  const user = await User.findById(decoded.userId);
  if (!user) throw new Error("User not found");

  user.password = await bcryptjs.hash(
    newPassword,
    Number(varEnv.BCRYPT_SALT_ROUND),
  );
  await user.save();
};

export const authServices = {
  loginCredentials,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgetPassword,
  resetPasswordWithToken,
};

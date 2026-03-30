import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const loginCredentials = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
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

  const accessToken = jwt.sign(
    {
      userId: userExists._id,
      email: userExists.email,
      role: userExists.role,
    },
    "secret",
    { expiresIn: "2d" },
  );

  return {
    // email: userExists.email,
    accessToken,
  };
};

export const authServices = {
  loginCredentials,
};

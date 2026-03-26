import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUserService = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  if (!name || !email) {
    throw new Error("Name and email are required");
  }
  const user = await User.create({ name, email });
  return user;
};

export const UserServices = {
  createUserService,
};

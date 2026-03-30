import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUserService = async (payload: Partial<IUser>) => {
  const { name, email, ...rest } = payload;
  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("User already exists");
  }

  const authProvider: IAuthProvider = {
    provider_name: "credentials",
    provider_id: email,
  };

  const user = await User.create({
    name,
    email,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUserService,
  getAllUsers,
};

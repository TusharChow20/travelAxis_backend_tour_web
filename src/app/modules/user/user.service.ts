import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import varEnv from "../../config/env";
const createUserService = async (payload: Partial<IUser>) => {
  const { name, email, password, ...rest } = payload;
  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider_name: "credentials",
    provider_id: email,
  };

  const user = await User.create({
    name,
    email,
    auths: [authProvider],
    password: hashedPassword,
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
const getMe = async (userId: string) => {
  const users = await User.findById(userId).select("-password");
  return {
    data: users,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const userExists = await User.findById(userId);
  if (!userExists) throw new Error("User not found");

  if (userExists.isDeleted || userExists.isActive === IsActive.BLOCKED) {
    throw new Error("This user cannot be updated");
  }

  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    // ✅ Compare as strings to avoid ObjectId mismatch
    if (decodedToken.userId?.toString() !== userId?.toString()) {
      throw new Error("You can only update your own profile");
    }

    const restrictedFields: (keyof IUser)[] = [
      "role",
      "isActive",
      "isDeleted",
      "isVerified",
    ];

    for (const field of restrictedFields) {
      if (payload[field] !== undefined) {
        throw new Error(`You are not authorized to change ${field}`);
      }
    }
  }

  if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    throw new Error("You are not authorized to assign SUPER_ADMIN role");
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(varEnv.BCRYPT_SALT_ROUND),
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: false,
  }).select("-password");

  return updatedUser;
};
export const UserServices = {
  createUserService,
  getAllUsers,
  updateUser,
  getMe,
};

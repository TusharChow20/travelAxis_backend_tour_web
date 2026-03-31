import varEnv from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
export const seedSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({
      email: varEnv.SUPER_ADMIN_EMAIL as string,
    });
    if (superAdminExists) {
      console.log("Admin Exists");
      return;
    }

    const hashedPass = await bcryptjs.hash(
      varEnv.SUPER_ADMIN_PASSWORD as string,
      Number(varEnv.BCRYPT_SALT_ROUND),
    );
    const authProvider: IAuthProvider = {
      provider_id: varEnv.SUPER_ADMIN_EMAIL as string,
      provider_name: "credentials",
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: varEnv.SUPER_ADMIN_EMAIL as string,
      password: hashedPass,
      isVerified: true,

      auths: [authProvider],
    };
    const superAdmin = await User.create(payload);
    console.log(superAdmin);
  } catch (error) {}
};

import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { ZodObject } from "zod";
import { createUserSchemaZodValidation } from "./user.validation";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import varEnv from "../../config/env";
const router = Router();

const checkAuthentication =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw Error("Unauthorized");
      }
      const verifyToken1 = verifyToken(
        token,
        varEnv.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      if (!roles.includes(verifyToken1.role)) {
        throw new Error("Forbidden: Insufficient permissions");
      }
      console.log(verifyToken1);
      next();
    } catch (error) {
      next(error);
    }
  };

router.post(
  "/register",
  validateUserRequest(createUserSchemaZodValidation),
  UserControllers.createUser,
);

router.get(
  "/all-users",
  checkAuthentication("ADMIN", "SUPER_ADMIN"),
  UserControllers.getAllUser,
);

export const UserRoutes = router;

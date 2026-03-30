import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { ZodObject } from "zod";
import { createUserSchemaZodValidation } from "./user.validation";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validateUserRequest(createUserSchemaZodValidation),
  UserControllers.createUser,
);

router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw Error("Unauthorized");
      }
      const verifyToken = jwt.verify(token, "secret");

      if (
        (verifyToken as JwtPayload).role !== (Role.ADMIN || Role.SUPER_ADMIN)
      ) {
        throw new Error("Forbidden: Insufficient permissions");
      }
      console.log(verifyToken);
      next();
    } catch (error) {
      next(error);
    }
  },
  UserControllers.getAllUser,
);

export const UserRoutes = router;

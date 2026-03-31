import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { ZodObject } from "zod";
import { createUserSchemaZodValidation } from "./user.validation";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import varEnv from "../../config/env";
import { checkAuthentication } from "../../middlewares/checkAuth";
const router = Router();



router.post(
  "/register",
  validateUserRequest(createUserSchemaZodValidation),
  UserControllers.createUser,
);

router.get(
  "/all-users",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser,
);

export const UserRoutes = router;

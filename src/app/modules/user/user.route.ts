import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { ZodObject } from "zod";
import { createUserSchemaZodValidation } from "./user.validation";
import { validateUserRequest } from "../../middlewares/userValidateRequest";

const router = Router();

router.post(
  "/register",
  validateUserRequest(createUserSchemaZodValidation),
  UserControllers.createUser,
);

router.get("/all-users", UserControllers.getAllUser);

export const UserRoutes = router;

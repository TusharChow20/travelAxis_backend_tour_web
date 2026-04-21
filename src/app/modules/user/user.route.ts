import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserSchemaZodValidation } from "./user.validation";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import { Role } from "./user.interface";
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

router.get("/me",checkAuthentication(...Object.values(Role)), UserControllers.getMe)
router.patch(
  "/:id",
  // validateUserRequest(createUserSchemaZodValidation),
  checkAuthentication(...Object.values(Role)),
  UserControllers.updateUser,
);

export const UserRoutes = router;

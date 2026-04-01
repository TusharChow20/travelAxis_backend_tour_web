import { Router } from "express";
import { authControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuthentication } from "../../middlewares/checkAuth";

const router = Router();

router.post("/login", authControllers.loginCredentials);
router.post("/refresh-token", authControllers.getNewAccessToken);
router.post("/logout", authControllers.logout);
router.post("/reset-password",checkAuthentication(...Object.values(Role)), authControllers.resetPassword)
export const AuthRoutes = router;

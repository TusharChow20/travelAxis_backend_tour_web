import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/login", authControllers.loginCredentials);
router.post("/refresh-token", authControllers.getNewAccessToken)
export const AuthRoutes = router;

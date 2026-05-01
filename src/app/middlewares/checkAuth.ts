// checkAuth.ts
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import varEnv from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuthentication =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Error("Unauthorized");

      // ✅ Split "Bearer <token>" to get just the token
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      if (!token) throw new Error("Unauthorized");

      const verifyToken1 = verifyToken(
        token,
        varEnv.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      if (!roles.includes(verifyToken1.role)) {
        throw new Error("Forbidden: Insufficient permissions");
      }

      req.user = verifyToken1;
      next();
    } catch (error) {
      next(error);
    }
  };

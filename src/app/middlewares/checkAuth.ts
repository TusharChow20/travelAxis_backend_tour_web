import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import varEnv from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuthentication =
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
      req.user = verifyToken1;
      console.log(verifyToken1);
      next();
    } catch (error) {
      next(error);
    }
  };

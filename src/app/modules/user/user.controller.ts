import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserServices.createUserService(req.body);

    res.status(201).json({
      message: "User Inserted Successfully",
      user,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const UserControllers = {
  createUser,
};

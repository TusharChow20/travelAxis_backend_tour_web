import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserService(req.body);

    res.status(201).json({
      message: "User Inserted Successfully",
      user,
    });
  },
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "All users",
      users,
    });
  },
);

export const UserControllers = {
  createUser,
  getAllUser,
};

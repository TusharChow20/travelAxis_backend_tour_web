import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserService(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Inserted Successfully",
      data: user,
    });
  },
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All user",
      data: users.users,
      meta: users.meta,
    });
  },
);

export const UserControllers = {
  createUser,
  getAllUser,
};

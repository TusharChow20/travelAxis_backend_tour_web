import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import varEnv from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const verifiedToken = req.user;
    if (!verifiedToken) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "User not authenticated",
        data: null,
      });
    }
    const payload = req.body;

    console.log(payload);
    const user = await UserServices.updateUser(
      userId as string,
      payload,
      verifiedToken,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  },
);
export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
};

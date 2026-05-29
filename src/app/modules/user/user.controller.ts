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

const getAllUser = catchAsync(async (req, res, next) => {
  const users = await UserServices.getAllUsers(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users",
    data: users,
    meta: {
      total: users.meta.total,
      page: users.meta.page,
      limit: users.meta.limit,
      totalPage: Math.ceil(users.meta.total / users.meta.limit),
    },
  });
});

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user as JwtPayload & { userId: string };

    if (!decodedToken) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "User not authenticated",
        data: null,
      });
    }

    if (!userId || Array.isArray(userId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user id",
        data: null,
      });
    }

    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, decodedToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  },
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken.userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User profile get",
      data: result,
    });
  },
);
export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
  getMe,
};

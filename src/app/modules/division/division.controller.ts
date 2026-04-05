import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionService.createDivision(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Inserted Successfully",
      data: division,
    });
  },
);

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivisions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
    meta: result.meta,
  });
});

export const DivisionControllers = {
  createDivision,
  getAllDivisions,
};

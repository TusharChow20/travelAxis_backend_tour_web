import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.createTour(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Inserted Successfully",
      data: tour,
    });
  },
);

export const TourController = {
  createTour,
};

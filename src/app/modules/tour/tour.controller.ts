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

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TourService.updateTour(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});
const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;

  const result = await TourService.getAllTours(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});
export const TourController = {
  createTour,
  updateTour,
  getAllTours,
};

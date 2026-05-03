import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourDurationService } from "./tourDuration.service";

const createTourDuration = catchAsync(async (req: Request, res: Response) => {
  const result = await TourDurationService.createTourDuration(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour duration created successfully",
    data: result,
  });
});

const getAllTourDurations = catchAsync(async (req: Request, res: Response) => {
  const result = await TourDurationService.getAllTourDurations();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour durations retrieved successfully",
    data: result,
  });
});

const deleteTourDuration = catchAsync(async (req: Request, res: Response) => {
  await TourDurationService.deleteTourDuration(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour duration deleted successfully",
    data: null,
  });
});

export const TourDurationController = {
  createTourDuration,
  getAllTourDurations,
  deleteTourDuration,
};

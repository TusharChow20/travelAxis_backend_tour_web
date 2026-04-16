import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body.data ? JSON.parse(req.body.data) : req.body;

    const files = req.files as Express.Multer.File[];

    const payload: ITour = {
      ...body,
      images: files?.map((file) => file.path),
    };

    const tour = await TourService.createTour(payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour Inserted Successfully",
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

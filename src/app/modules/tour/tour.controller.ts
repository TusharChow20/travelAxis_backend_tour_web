import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";

const parseBody = (body: any): Record<string, unknown> => {
  if (!body?.data || body.data === "undefined") return body ?? {};
  try {
    return JSON.parse(body.data);
  } catch {
    return body;
  }
};

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = parseBody(req.body);
    const files = req.files as Express.Multer.File[];

    const payload: Partial<ITour> = {
      ...body,
      images: files?.map((file) => file.path) ?? [],
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
  const body = parseBody(req.body); // ✅ safe
  const files = req.files as Express.Multer.File[];

  const payload: Partial<ITour> = {
    ...body,
    ...(files?.length > 0 && { images: files.map((file) => file.path) }),
  };

  const result = await TourService.updateTour(id, payload);
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
    message: "Tours retrieved successfully",
    data: result,
  });
});
const getTourSuggestions = catchAsync(async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;
  const result = await TourService.getTourSuggestions(searchTerm);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Suggestions retrieved",
    data: result,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await TourService.getSingleTour(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour retrieved successfully",
    data: result,
  });
});
export const TourController = {
  createTour,
  updateTour,
  getAllTours,
  getTourSuggestions,
  getSingleTour,
};

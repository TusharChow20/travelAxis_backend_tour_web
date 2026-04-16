import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body.data ? JSON.parse(req.body.data) : req.body;

    const payload: IDivision = {
      ...body,
      thumbnail: req.file?.path,
    };

    const division = await DivisionService.createDivision(payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Division Created Successfully",
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
const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await DivisionService.updateDivision(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division updated",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.deleteDivision(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division deleted",
    data: result,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await DivisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
  });
});

export const DivisionControllers = {
  createDivision,
  getAllDivisions,
  deleteDivision,
  updateDivision,
  getSingleDivision,
};

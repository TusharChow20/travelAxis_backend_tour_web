import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Di;
  },
);

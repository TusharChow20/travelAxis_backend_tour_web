import { Response } from "express";

interface IMeta {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}
interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}
export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    data: data.data,
    message: data.message,
  });
};

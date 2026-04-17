import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { deleteImageFromCloud } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file?.path) {
    await deleteImageFromCloud(req.file.path);
  }

  // Delete multiple files on error
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path, //
    );
    await Promise.all(imageUrls.map((url) => deleteImageFromCloud(url)));
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

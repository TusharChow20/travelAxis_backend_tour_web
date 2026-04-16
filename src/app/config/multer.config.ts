import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import path from "path";
import cloudinary from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req: Request, file: Express.Multer.File) => {
      //   const fileName = path.parse(file.originalname).name; // strips extension
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-");

      const extension = file.originalname.split(".").pop();
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      return `${uniqueSuffix}-${fileName}.${extension}`;
    },
  } as any,
});

export const multerUpload = multer({ storage: storage });

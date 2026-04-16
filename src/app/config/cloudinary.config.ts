import { v2 as cloudinary } from "cloudinary";
import varEnv from "./env";

cloudinary.config({
  cloud_name: varEnv.CLOUDINARY.CLOUDINARY_CLOUD_NAME as string,
  api_key: varEnv.CLOUDINARY.CLOUDINARY_API_KEY as string,
  api_secret: varEnv.CLOUDINARY.CLOUDINARY_API_SECRET as string,
});
export default cloudinary;

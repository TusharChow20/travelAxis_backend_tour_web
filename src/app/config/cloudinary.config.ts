import { v2 as cloudinary } from "cloudinary";
import varEnv from "./env";

cloudinary.config({
  cloud_name: varEnv.CLOUDINARY.CLOUDINARY_CLOUD_NAME as string,
  api_key: varEnv.CLOUDINARY.CLOUDINARY_API_KEY as string,
  api_secret: varEnv.CLOUDINARY.CLOUDINARY_API_SECRET as string,
});

export const deleteImageFromCloud = async (url: string): Promise<void> => {
  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // strip extension

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error(`Cloudinary delete failed: ${result.result}`);
    }
  } catch (error) {
    console.error("deleteImageFromCloud error:", error);
    throw error;
  }
};

export const deleteImagesFromCloud = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map((url) => deleteImageFromCloud(url)));
};

export default cloudinary;

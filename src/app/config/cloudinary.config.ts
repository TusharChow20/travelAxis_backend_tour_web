import { v2 as cloudinary } from "cloudinary";
import varEnv from "./env";

cloudinary.config({
  cloud_name: varEnv.CLOUDINARY.CLOUDINARY_CLOUD_NAME as string,
  api_key: varEnv.CLOUDINARY.CLOUDINARY_API_KEY as string,
  api_secret: varEnv.CLOUDINARY.CLOUDINARY_API_SECRET as string,
});

export const deleteImageFromCloud = async (url: string): Promise<void> => {
  try {
    //  Skip empty or non-cloudinary URLs
    if (!url || !url.includes("cloudinary.com")) return;

    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1) return; // ✅ not a valid cloudinary URL

    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

    const result = await cloudinary.uploader.destroy(publicId);

    //  "not found" is not a fatal error — image may have been deleted already
    if (result.result !== "ok" && result.result !== "not found") {
      console.warn(
        `Cloudinary delete warning: ${result.result} for ${publicId}`,
      );
    }
  } catch (error) {
    //  Never throw — deletion failure should not block uploads
    console.warn("deleteImageFromCloud warning:", error);
  }
};

export const deleteImagesFromCloud = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map((url) => deleteImageFromCloud(url)));
};

export default cloudinary;

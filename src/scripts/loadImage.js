import path from "path";

import unsecureId from "@kenstack/utils/unsecureId";
import normalizeFilename from "@kenstack/utils/normalizeFilename";
import { v2 as cloudinary } from "cloudinary";

import cloudinaryToImage from "@kenstack/forms/Image/utils/cloudinaryToImage";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // ensure this matches your env variable name
  secure: true,
});

export default async function loadImage(image) {
  if (!image) {
    return;
  }
  const { src } = image;
  const filePath = path.resolve("./public", src.slice(1));

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.SITE_NAME + "/images/" + unsecureId();

  // Use the file's base name as public_id after normalization
  const public_id = normalizeFilename(path.basename(src));

  const eager = [
    "f_webp", // Original dimensions as WebP
    "w_200,h_200,c_thumb,g_center,f_webp", // Thumbnail as WebP
  ].join("|");

  const options = {
    timestamp,
    folder,
    public_id,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    eager,
  };

  const signature = cloudinary.utils.api_sign_request(
    options,
    process.env.CLOUDINARY_API_SECRET,
  );

  const uploadOptions = {
    ...options,
    api_key: process.env.CLOUDINARY_API_KEY,
    signature,
  };

  const result = await cloudinary.uploader.upload(filePath, uploadOptions);

  if (result.error) {
    throw Error("Problem uploading image: " + result.error);
  }

  return cloudinaryToImage(result, path.basename(src));
}

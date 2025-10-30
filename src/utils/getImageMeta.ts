import path from "path";
import sharp from "sharp";

export type ImageResult = null | {
  src: string;
  width: number;
  height: number;
  alt: "";
};

const cache = new Map();
export default async function getImageSize(
  imagePath: string
): Promise<ImageResult> {
  if (cache.has(imagePath)) {
    return cache.get(imagePath);
  }

  const filePath = path.resolve("./public", imagePath.replace(/^\//, ""));

  let meta;
  try {
    const image = sharp(filePath);
    meta = await image.metadata();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // can't find the image.
    cache.set(imagePath, null);
    return null;
  }

  const retval = {
    src: imagePath,
    width: meta.width,
    height: meta.height,
    alt: "",
  } satisfies ImageResult;

  cache.set(imagePath, retval);
  return retval;
}

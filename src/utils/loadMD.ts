import { cache } from "react";

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import getImageMeta, { type ImageResult } from "./getImageMeta";
import { pageSchema } from "@/schemas/page";
import * as z from "zod";

import type { Metadata } from "next";

// Replace raw front‑matter fields with processed versions
type WithProcessedImage<T> = Omit<T, "image" | "content"> & {
  image: ImageResult | null;
  content: string;
};

export default async function loadMD<S extends z.ZodObject = typeof pageSchema>(
  localPath: string,
  schema?: S
): Promise<false | WithProcessedImage<z.infer<S>>> {
  const usedSchema = (schema ?? pageSchema) as S;
  const matterResult = await load(localPath);

  if (!matterResult) {
    return false;
    // throw Error(`There was a problem loading ${localPath}`);
  }

  const result = usedSchema.strict().safeParse(matterResult?.data);
  if (!result.success) {
    throw Error(
      `Validation error in: ${localPath}:\n${z.prettifyError(result.error)}`
    );
  }
  const data = result.data;

  // Only show draft content on development
  if (
    data.draft === true &&
    process.env.VERCEL_ENV !== "preview" &&
    process.env.NODE_ENV === "production"
  ) {
    return false;
  }

  let image: ImageResult | null = null;

  if ("image" in data && typeof data.image === "string" && data.image) {
    image = await getImageMeta(data.image);
  }

  return {
    ...data,
    content: matterResult.content,
    image,
  } as WithProcessedImage<z.infer<S>>;
}

async function loadMetadata(localPath: string): Promise<Metadata> {
  const result = await load(localPath);

  if (result === false || result.data.draft) {
    return {};
  }

  const { data } = result;

  return {
    title: data.meta_title || data.title,
    description: data.description ?? "",
  } satisfies Metadata;
}

const load = cache(async (localPath: string) => {
  // make it possible to see md changes on dev.

  if (!localPath.endsWith(".md")) {
    localPath += ".md";
  }
  const fullPath = path.resolve("./src/content", localPath);

  let fileContents: string;
  try {
    fileContents = await fs.readFile(fullPath, "utf8");
  } catch {
    return false;
  }

  // Use gray-matter to parse the post metadata section
  return matter(fileContents);
});

export { loadMD, loadMetadata };

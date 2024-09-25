import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
// import { remark } from "remark";
// import toHtml from "remark-html";

import getImageMeta from "./getImageMeta";

export default async function loadMD(localPath) {
  if (!localPath.endsWith(".md")) {
    localPath += ".md";
  }
  const fullPath = path.resolve("./src/content", localPath);

  let fileContents;
  try {
    fileContents = await fs.readFile(fullPath, "utf8");
  } catch (e) {
    return false;
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Only show draft content on development
  if (
    matterResult.data.draft === true &&
    process.env.NODE_ENV !== "development"
  ) {
    return false;
  }

  // Use remark to convert markdown into HTML string
  /*
  const processedContent = await remark()
    .use(toHtml)
    .process(matterResult.content);
  const html = processedContent.toString();
  */

  let image = null;

  if (matterResult.data.image) {
    image = await getImageMeta(matterResult.data.image);
  }

  return {
    content: matterResult.content,
    ...matterResult.data,
    image,
  };
}

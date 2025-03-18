import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import getImageMeta from "./getImageMeta";

export default async function loadMD(localPath) {
  const directory = path.resolve("./src/content", localPath);
  const entries = await fs.readdir(directory, { withFileTypes: true });

  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    // .filter((entry) => !entry.name.includes("TODO"))
    .map((entry) => path.join(directory, entry.name));

  const retval = [];
  for (const filePath of markdownFiles) {
    const fileContents = await fs.readFile(filePath, "utf8");
    const result = matter(fileContents);

    const slug = path.basename(filePath).replace(/\.md$/, "");

    // Only show draft content on development
    if (
      result.data.draft === true &&
      process.env.VERCEL_ENV !== "preview" &&
      process.env.NODE_ENV === "production"
    ) {
      continue;
    }

    let image = null;
    if (result.data.image) {
      image = await getImageMeta(result.data.image);
    }

    retval.push({
      // ...result.content,
      ...result.data,
      image,
      slug,
      content: result.content,
    });
  }
  return retval;
}

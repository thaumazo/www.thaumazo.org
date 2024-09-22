import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export default async function loadMD(localPath) {

  const fullPath = path.resolve("./src/content", localPath);

/*
  const fileContents = await fs.readFile(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
*/

 /*
  return {
    content: html,
    ...matterResult.data,
  };
  */
}

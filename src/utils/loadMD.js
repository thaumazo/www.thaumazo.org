import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import toHtml from "remark-html";

export default async function loadMD(localPath) {
  const fullPath = path.resolve("./src/content", localPath);

  const fileContents = await fs.readFile(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  console.log(matterResult);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(toHtml)
    .process(matterResult.content);
  const html = processedContent.toString();

  return {
    content: html,
    ...matterResult.data,
  };
}

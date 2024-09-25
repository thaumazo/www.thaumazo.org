import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

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
    if (result.data.draft === true && process.env.NODE_ENV !== "development") {
      continue;
    }

    retval.push({
      ...result.content,
      ...result.data,
      slug,
    });
  }
  return retval;
}

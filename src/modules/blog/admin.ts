import { desc } from "drizzle-orm";

import { blogs, blogTags } from "./tables";
import { NotebookPen } from "lucide-react";

import { adminTable } from "@kenstack/admin";
import client from "./client";
import { fields } from "./fields";

const config = adminTable({
  client,
  fields,
  title: "Blog",
  icon: NotebookPen,
  table: blogs,
  revalidate: ["blog", ({ slug }) => `blog-${slug}`],
  // fields: { image: { transformations: imageTransformations } },
  orderBy: [desc(blogs.publishedAt), desc(blogs.id)],
  select: { title: blogs.title, publishedAt: blogs.publishedAt },
  preview: "/learning-centre/${slug}",
  tags: { table: blogTags },
});

export default config;

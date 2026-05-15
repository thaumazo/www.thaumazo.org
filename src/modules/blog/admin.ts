import { blogImages, blogs, blogTags } from "./tables";
import { NotebookPen } from "lucide-react";

import { adminTable } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
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
  sort: {
    title: {
      fields: [blogs.title],
    },
  },
  filters: {
    publishedAt: {
      field: blogs.publishedAt,
      kind: "date-range",
      label: "Published",
    },
    draft: {
      field: blogs.draft,
      kind: "boolean",
      label: "Hidden",
    },
  },
  select: {
    title: blogs.title,
    image: selectImageSubquery(blogs.image, "square"),
    publishedAt: blogs.publishedAt,
  },
  // preview: "/learning-centre/${slug}",
  tags: { table: blogTags },
  galleries: {
    gallery: {
      table: blogImages,
      tableIdKey: "blogId",
      tableId: blogImages.blogId,
      imageIdKey: "imageId",
      imageId: blogImages.imageId,
      sortOrderKey: "sortOrder",
      sortOrder: blogImages.sortOrder,
    },
  },
});

export default config;

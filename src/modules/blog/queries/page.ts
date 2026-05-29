import { selectImageSubquery } from "@kenstack/db/tables";
import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { blog } from "../tables";
import { loadBlogTags } from "./tags";

type BlogQueryOptions = {
  draft?: boolean;
};

export async function loadBlogPage(
  slug: string,
  options: BlogQueryOptions = {},
) {
  const { draft = false } = options;

  if (!draft) {
    return loadCachedRows(slug);
  }

  return loadRow(slug, options);
}

async function loadCachedRows(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("blog", `blog:${slug}`);

  return loadRow(slug);
}

async function loadRow(slug: string, options: BlogQueryOptions = {}) {
  const visibility = await pageWhere(blog, options);
  const [row] = await deps.db
    .select({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      publishedAt: blog.publishedAt,
      image: selectImageSubquery(blog.image, "original"),
      description: blog.description,
      content: blog.content,
      seoTitle: blog.seoTitle,
      seoDescription: blog.seoDescription,
      ogImage: selectImageSubquery(blog.ogImage, "original"),
    })
    .from(blog)
    .where(and(visibility, eq(blog.slug, slug)))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    ...row,
    tags: await loadBlogTags(row.id),
  };
}

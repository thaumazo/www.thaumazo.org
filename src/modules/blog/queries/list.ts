import { selectImageSubquery, tags } from "@kenstack/db/tables";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { blog, blog_tags } from "../tables";

type ListBlogsOptions = {
  draft?: boolean;
  tag?: string;
};

export async function loadBlogList(options: ListBlogsOptions = {}) {
  const { draft = false, tag } = options;

  if (!draft) {
    return loadCachedRows({ tag });
  }

  return loadRows({ draft, tag });
}

async function loadCachedRows({
  tag,
}: {
  tag?: string;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag("blog", ...(tag ? [`blog:tag:${tag}`] : []));

  return loadRows({ tag });
}

async function loadRows({ draft = false, tag }: ListBlogsOptions = {}) {
  const blogListSelect = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    publishedAt: blog.publishedAt,
    image: selectImageSubquery(blog.image, "square"),
  };
  const visibility = await listWhere(blog, { draft });

  if (tag) {
    return deps.db
      .select(blogListSelect)
      .from(blog)
      .innerJoin(blog_tags, eq(blog_tags.tableId, blog.id))
      .innerJoin(tags, eq(blog_tags.tagId, tags.id))
      .where(and(visibility, eq(tags.slug, tag)))
      .orderBy(desc(blog.publishedAt), desc(blog.id));
  }

  return deps.db
    .select(blogListSelect)
    .from(blog)
    .where(visibility)
    .orderBy(desc(blog.publishedAt), desc(blog.id));
}

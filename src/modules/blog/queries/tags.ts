import { tags } from "@kenstack/db/tables";
import { asc, eq } from "drizzle-orm";

import { deps } from "@app/deps";
import { blog_tags } from "../tables";

export async function loadBlogTags(blogId: number) {
  return deps.db
    .select({
      name: tags.name,
      slug: tags.slug,
    })
    .from(blog_tags)
    .innerJoin(tags, eq(blog_tags.tagId, tags.id))
    .where(eq(blog_tags.tableId, blogId))
    .orderBy(asc(tags.name));
}

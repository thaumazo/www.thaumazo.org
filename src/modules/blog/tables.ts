import { defineTable, metaColumns } from "@kenstack/admin/table";
import { sql } from "drizzle-orm";
import { text, integer, index, uniqueIndex } from "drizzle-orm/pg-core";

import { defineMediaList, defineTags } from "@kenstack/db/tables";

export const blog = defineTable({
  name: "blog",
  columns: {
    ...metaColumns,
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),
    image: integer("image"),
    description: text().notNull().default(""),
    content: text().notNull().default(""),
  },
  extraConfig: (t) => [
    index("blog_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),

    uniqueIndex("blog_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
});

export const blog_tags = defineTags({ table: blog, prefix: "blog" });
export const blog_media = defineMediaList({ table: blog, prefix: "blog" });

import { defineTable } from "@kenstack/admin/table";
import { sql } from "drizzle-orm";
import {
  text,
  boolean,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import * as z from "zod";
import { image } from "@kenstack/schemas/atoms";
type Image = z.infer<ReturnType<typeof image>>;

import { defineTags } from "@kenstack/db/tables";

export const blogs = defineTable({
  name: "blogs",
  columns: {
    publishedAt: timestamp("published_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),

    image: jsonb("image").$type<Image>(),
    description: text(),
    content: text(),
    draft: boolean().notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
  },
  extraConfig: (t) => [
    index("blogs_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),

    uniqueIndex("blogs_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
});

export const blogTags = defineTags({ table: blogs, prefix: "blog" });

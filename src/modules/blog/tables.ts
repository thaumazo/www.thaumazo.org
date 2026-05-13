import { defineTable } from "@kenstack/admin/table";
import { sql } from "drizzle-orm";
import {
  text,
  boolean,
  // jsonb,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// import * as z from "zod";
// import { image } from "@kenstack/schemas/atoms";
// type Image = z.infer<ReturnType<typeof image>>;

import { defineTags } from "@kenstack/db/tables";
import { images } from "@kenstack/db/tables";

export const blogs = defineTable({
  name: "blogs",
  columns: {
    publishedAt: timestamp("published_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),

    // image: jsonb("image").$type<Image>(),
    image: integer("image"),

    description: text().notNull().default(""),
    content: text().notNull().default(""),
    draft: boolean().notNull(),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
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

export const blogImages = defineTable({
  name: "blog_images",
  columns: {
    blogId: integer("blog_id")
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    imageId: integer("image_id")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  extraConfig: (t) => [
    uniqueIndex("blog_images_blog_id_image_id_unique").on(t.blogId, t.imageId),
    index("blog_images_blog_id_sort_order_idx").on(t.blogId, t.sortOrder),
  ],
});

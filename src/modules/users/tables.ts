import { defineUsersTable } from "@kenstack/modules/users/tables";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = defineUsersTable({
  columns: {
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    description: text("description").notNull().default(""),
    content: text("content").notNull().default(""),
    draft: boolean("draft").notNull().default(true),
    linkedin: text("linkedin").notNull().default(""),
    communityRoles: text("community_roles")
      .array()
      .notNull()
      .default(sql`'{}'`),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
  },
  extraConfig: (t) => [
    index("users_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),
    uniqueIndex("users_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL AND ${t.slug} IS NOT NULL`),
  ],
});

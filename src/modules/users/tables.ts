import {
  userColumns,
  userTableExtraConfig,
} from "@kenstack/modules/users/tables";
import { defineTable, metaColumns } from "@kenstack/admin/table";
import { sql } from "drizzle-orm";
import { index, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = defineTable({
  name: "users",
  columns: {
    ...userColumns,
    ...metaColumns,
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),
    description: text("description").notNull().default(""),
    content: text("content").notNull().default(""),
    linkedin: text("linkedin").notNull().default(""),
    communityRoles: text("community_roles")
      .array()
      .notNull()
      .default(sql`'{}'`),
  },
  extraConfig: (t) => [
    ...userTableExtraConfig(t),
    index("users_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),
    uniqueIndex("users_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL AND ${t.slug} IS NOT NULL`),
  ],
});

import {
  userColumns,
  userTableExtraConfig,
} from "@kenstack/modules/users/tables";
import { defineTable } from "@kenstack/admin/table";
import { sql } from "drizzle-orm";
import { text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = defineTable({
  name: "users",
  publicId: false,
  publish: true,
  seo: true,
  columns: {
    ...userColumns,
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
    uniqueIndex("users_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL AND ${t.slug} IS NOT NULL`),
  ],
});

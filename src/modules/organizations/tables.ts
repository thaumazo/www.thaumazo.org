import { defineRelationship, defineTable } from "@kenstack/admin/table";
import { defineTags } from "@kenstack/db/tables";
import { users } from "@/modules/users/tables";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const organizations = defineTable({
  name: "organizations",
  columns: {
    publishedAt: timestamp("published_at", { withTimezone: true }),
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),
    image: integer("image"),
    description: text("description").notNull().default(""),
    content: text("content").notNull().default(""),
    draft: boolean("draft").notNull().default(true),
    url: text("url").notNull().default(""),
    kind: text("kind")
      .array()
      .notNull()
      .default(sql`'{}'`),
    sdgs: text("sdgs")
      .array()
      .notNull()
      .default(sql`'{}'`),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
  },
  extraConfig: (t) => [
    index("organizations_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),
    uniqueIndex("organizations_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
});

export const userOrganizations = defineRelationship({
  name: "user_organizations",
  from: { name: "user", table: users },
  to: { name: "organization", table: organizations },
});

export const organizationTags = defineTags({
  table: organizations,
  prefix: "organization",
});

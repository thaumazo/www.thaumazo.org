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

export const services = defineTable({
  name: "services",
  columns: {
    publishedAt: timestamp("published_at", { withTimezone: true }),
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),
    image: integer("image"),
    description: text("description").notNull().default(""),
    content: text("content").notNull().default(""),
    draft: boolean("draft").notNull().default(true),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
  },
  extraConfig: (t) => [
    index("services_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),
    uniqueIndex("services_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
});

export const userServices = defineRelationship({
  name: "user_services",
  from: { name: "user", table: users },
  to: { name: "service", table: services },
});

export const serviceTags = defineTags({ table: services, prefix: "service" });

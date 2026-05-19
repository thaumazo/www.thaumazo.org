import {
  defineRelationship,
  defineTable,
  metaColumns,
} from "@kenstack/admin/table";
import { defineTags } from "@kenstack/db/tables";
import { users } from "@/modules/users/tables";
import { sql } from "drizzle-orm";
import { index, integer, text, uniqueIndex } from "drizzle-orm/pg-core";

export const services = defineTable({
  name: "services",
  columns: {
    ...metaColumns,
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),
    image: integer("image"),
    description: text("description").notNull().default(""),
    content: text("content").notNull().default(""),
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

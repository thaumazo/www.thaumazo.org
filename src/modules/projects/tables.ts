import {
  defineRelationship,
  defineTable,
  metaColumns,
} from "@kenstack/admin/table";
import { defineTags } from "@kenstack/db/tables";
import { organizations } from "@/modules/organizations/tables";
import { users } from "@/modules/users/tables";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const projects = defineTable({
  name: "projects",
  columns: {
    ...metaColumns,
    title: text("title").notNull().default(""),
    slug: text("slug").notNull().default(""),
    image: integer("image"),
    description: text("description").notNull().default(""),
    content: text("content").notNull().default(""),
    url: text("url").notNull().default(""),
    location: text("location").notNull().default(""),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    status: text("status").notNull().default("Proposed"),
    kind: text("kind")
      .array()
      .notNull()
      .default(sql`'{}'`),
    sdgs: text("sdgs")
      .array()
      .notNull()
      .default(sql`'{}'`),
  },
  extraConfig: (t) => [
    index("projects_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),
    uniqueIndex("projects_slug_unique")
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
});

export const userProjects = defineRelationship({
  name: "user_projects",
  from: { name: "user", table: users },
  to: { name: "project", table: projects },
});

export const projectOrganizations = defineRelationship({
  name: "project_organizations",
  from: { name: "project", table: projects },
  to: { name: "organization", table: organizations },
});

export const projectTags = defineTags({ table: projects, prefix: "project" });

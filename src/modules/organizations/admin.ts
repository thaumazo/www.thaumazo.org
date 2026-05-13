import { desc } from "drizzle-orm";
import { Building2 } from "lucide-react";

import { adminTable } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import client from "./client";
import { fields } from "./fields";
import { relationships } from "./relationships";
import { organizations, organizationTags } from "./tables";

const config = adminTable({
  client,
  fields,
  relationships,
  title: "Organizations",
  icon: Building2,
  table: organizations,
  orderBy: [desc(organizations.publishedAt), desc(organizations.id)],
  select: {
    title: organizations.title,
    image: selectImageSubquery(organizations.image, "square"),
    publishedAt: organizations.publishedAt,
  },
  preview: "/organizations/${slug}",
  revalidate: ["organizations", ({ slug }) => `organizations:${slug}`],
  tags: { table: organizationTags },
});

export default config;

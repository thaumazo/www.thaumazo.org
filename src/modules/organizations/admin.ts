import { Building2 } from "lucide-react";

import { adminTable } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import client from "./client";
import { fields, organizationKindOptions, sdgNameOptions } from "./fields";
import { relationships } from "./relationships";
import { organizations, organizationTags } from "./tables";

const config = adminTable({
  client,
  fields,
  relationships,
  title: "Organizations",
  icon: Building2,
  table: organizations,
  sort: {
    title: {
      fields: [organizations.title],
    },
  },
  filters: {
    publishedAt: {
      field: organizations.publishedAt,
      kind: "date-range",
      label: "Published",
    },
    draft: {
      field: organizations.draft,
      kind: "boolean",
      label: "Hidden",
    },
    kind: {
      field: organizations.kind,
      kind: "includes",
      options: organizationKindOptions,
    },
    sdgs: {
      field: organizations.sdgs,
      kind: "includes",
      label: "SDGs",
      options: sdgNameOptions,
    },
  },
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

import { HandHeart } from "lucide-react";

import { adminTable } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import client from "./client";
import { fields } from "./fields";
import { relationships } from "./relationships";
import { services, serviceTags } from "./tables";

const config = adminTable({
  client,
  fields,
  relationships,
  title: "Services",
  icon: HandHeart,
  table: services,
  sort: {
    newest: {
      fields: [services.publishedAt, services.createdAt],
      defaultDirection: "desc",
    },
    title: {
      fields: [services.title],
    },
  },
  filters: {
    publishedAt: {
      field: services.publishedAt,
      kind: "date-range",
      label: "Published",
    },
    draft: {
      field: services.draft,
      kind: "boolean",
      label: "Hidden",
    },
  },
  select: {
    title: services.title,
    image: selectImageSubquery(services.image, "square"),
    publishedAt: services.publishedAt,
  },
  preview: "/services/${slug}",
  revalidate: ["services", ({ slug }) => `services:${slug}`],
  tags: { table: serviceTags },
});

export default config;

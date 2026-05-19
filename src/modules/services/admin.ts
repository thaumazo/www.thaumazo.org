import { HandHeart } from "lucide-react";

import { adminConfig } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import client from "./client";
import { fields } from "./fields";
import { relationships } from "./relationships";
import { services, serviceTags } from "./tables";

const config = adminConfig({
  client,
  fields,
  relationships,
  title: "Services",
  icon: HandHeart,
  table: services,
  sort: {
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

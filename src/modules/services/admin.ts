import { desc } from "drizzle-orm";
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
  orderBy: [desc(services.publishedAt), desc(services.id)],
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

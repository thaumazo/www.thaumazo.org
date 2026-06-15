import { HandHeart } from "lucide-react";

import { defineModule } from "@kenstack/admin";
import { selectMediaSubquery } from "@kenstack/db/tables";
import {
  relationshipField,
  serverFields,
  tagField,
} from "@kenstack/fields/server";
import client from "./client";
import { fields } from "./fields";
import { relationships } from "./relationships";
import { services, serviceTags } from "./tables";

const config = defineModule({
  name: "services",
  client,
  title: "Services",
  icon: HandHeart,
  admin: {
    table: services,
    fields: serverFields(fields, {
      tags: tagField({ table: serviceTags }),
      liaisons: relationshipField(relationships.liaisons),
    }),
    revalidate: ["services", ({ slug }) => `services:${slug}`],
    list: {
      sort: {
        title: {
          fields: ["title"],
        },
      },
      filters: {
        publishedAt: {
          field: "publishedAt",
          kind: "date-range",
          label: "Published",
        },
      },
      select: {
        title: services.title,
        image: selectMediaSubquery(services.image, "square"),
        publishedAt: services.publishedAt,
      },
    },
  },
});

export default config;

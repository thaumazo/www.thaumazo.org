import { Building2 } from "lucide-react";

import { defineModule } from "@kenstack/admin";
import { selectMediaSubquery } from "@kenstack/db/tables";
import {
  relationshipField,
  serverFields,
  tagField,
} from "@kenstack/fields/server";
import client from "./client";
import { fields, organizationKindOptions, sdgNameOptions } from "./fields";
import { relationships } from "./relationships";
import { organizations, organizationTags } from "./tables";

const config = defineModule({
  name: "organizations",
  client,
  title: "Organizations",
  icon: Building2,
  admin: {
    table: organizations,
    fields: serverFields(fields, {
      tags: tagField({ table: organizationTags }),
      liaisons: relationshipField(relationships.liaisons),
    }),
    revalidate: ["organizations", ({ slug }) => `organizations:${slug}`],
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
        kind: {
          field: "kind",
          kind: "includes",
          options: organizationKindOptions,
        },
        sdgs: {
          field: "sdgs",
          kind: "includes",
          label: "SDGs",
          options: sdgNameOptions,
        },
      },
      select: {
        title: organizations.title,
        image: selectMediaSubquery(organizations.image, "square"),
        publishedAt: organizations.publishedAt,
      },
    },
  },
});

export default config;

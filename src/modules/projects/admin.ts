import { FolderKanban } from "lucide-react";

import { defineModule } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import {
  relationshipField,
  serverFields,
  tagField,
} from "@kenstack/fields/server";
import client from "./client";
import {
  fields,
  projectKindOptions,
  projectStatusOptions,
  sdgNameOptions,
} from "./fields";
import { relationships } from "./relationships";
import { projects, projectTags } from "./tables";

const config = defineModule({
  name: "projects",
  client,
  title: "Projects",
  icon: FolderKanban,
  admin: {
    table: projects,
    fields: serverFields(fields, {
      tags: tagField({ table: projectTags }),
      liaisons: relationshipField(relationships.liaisons),
      organizations: relationshipField(relationships.organizations),
    }),
    revalidate: ["projects", ({ slug }) => `projects:${slug}`],
    list: {
      sort: {
        title: {
          fields: ["title"],
        },
        status: {
          fields: ["status", "title"],
        },
      },
      filters: {
        publishedAt: {
          field: "publishedAt",
          kind: "date-range",
          label: "Published",
        },
        startDate: {
          field: "startDate",
          kind: "date-range",
          label: "Starts",
        },
        endDate: {
          field: "endDate",
          kind: "date-range",
          label: "Ends",
        },
        status: {
          field: "status",
          kind: "enum",
          options: projectStatusOptions,
        },
        kind: {
          field: "kind",
          kind: "includes",
          options: projectKindOptions,
        },
        sdgs: {
          field: "sdgs",
          kind: "includes",
          label: "SDGs",
          options: sdgNameOptions,
        },
      },
      select: {
        title: projects.title,
        image: selectImageSubquery(projects.image, "square"),
        publishedAt: projects.publishedAt,
      },
    },
  },
});

export default config;

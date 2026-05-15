import { FolderKanban } from "lucide-react";

import { adminTable } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import client from "./client";
import {
  fields,
  projectKindOptions,
  projectStatusOptions,
  sdgNameOptions,
} from "./fields";
import { relationships } from "./relationships";
import { projects, projectTags } from "./tables";

const config = adminTable({
  client,
  fields,
  relationships,
  title: "Projects",
  icon: FolderKanban,
  table: projects,
  revalidate: ["projects", ({ slug }) => `projects:${slug}`],
  sort: {
    title: {
      fields: [projects.title],
    },
    status: {
      fields: [projects.status, projects.title],
    },
  },
  filters: {
    publishedAt: {
      field: projects.publishedAt,
      kind: "date-range",
      label: "Published",
    },
    startDate: {
      field: projects.startDate,
      kind: "date-range",
      label: "Starts",
    },
    endDate: {
      field: projects.endDate,
      kind: "date-range",
      label: "Ends",
    },
    draft: {
      field: projects.draft,
      kind: "boolean",
      label: "Hidden",
    },
    status: {
      field: projects.status,
      kind: "enum",
      options: projectStatusOptions,
    },
    kind: {
      field: projects.kind,
      kind: "includes",
      options: projectKindOptions,
    },
    sdgs: {
      field: projects.sdgs,
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
  preview: "/projects/${slug}",
  tags: { table: projectTags },
});

export default config;

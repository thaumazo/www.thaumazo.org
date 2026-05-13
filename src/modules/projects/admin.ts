import { desc } from "drizzle-orm";
import { FolderKanban } from "lucide-react";

import { adminTable } from "@kenstack/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import client from "./client";
import { fields } from "./fields";
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
  orderBy: [desc(projects.publishedAt), desc(projects.id)],
  select: {
    title: projects.title,
    image: selectImageSubquery(projects.image, "square"),
    publishedAt: projects.publishedAt,
  },
  preview: "/projects/${slug}",
  tags: { table: projectTags },
});

export default config;

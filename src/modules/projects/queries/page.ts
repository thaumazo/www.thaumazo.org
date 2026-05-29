import { selectImageSubquery } from "@kenstack/db/tables";
import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { metaSelect } from "@kenstack/admin";
import { pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { projects } from "../tables";

export function getProject(slug: string, options: { draft?: boolean } = {}) {
  return options.draft ? loadProject(slug, options) : loadCachedProject(slug);
}

async function loadCachedProject(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("projects", `projects:${slug}`);

  return loadProject(slug);
}

async function loadProject(slug: string, options: { draft?: boolean } = {}) {
  const visibility = await pageWhere(projects, options);
  const [project] = await deps.db
    .select({
      id: projects.id,
      title: projects.title,
      slug: projects.slug,
      image: selectImageSubquery(projects.image, "original"),
      description: projects.description,
      content: projects.content,
      url: projects.url,
      location: projects.location,
      startDate: projects.startDate,
      endDate: projects.endDate,
      status: projects.status,
      kind: projects.kind,
      sdgs: projects.sdgs,
      ...metaSelect(projects),
    })
    .from(projects)
    .where(and(visibility, eq(projects.slug, slug)))
    .limit(1);

  return project ?? null;
}

import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere, pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { projects, userProjects } from "@/modules/projects/tables";
import { uniqueRelatedLinks } from "@/modules/siteContent";

type RelatedQueryOptions = {
  draft?: boolean;
};

export function listUserProjects(
  userId: number,
  options: RelatedQueryOptions = {},
) {
  const { draft = false } = options;
  return draft
    ? loadUserProjects(userId, options)
    : loadCachedUserProjects(userId);
}

async function loadCachedUserProjects(userId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("community", "projects");

  return loadUserProjects(userId);
}

async function loadUserProjects(
  userId: number,
  options: RelatedQueryOptions = {},
) {
  const { draft = false } = options;
  const visibility = draft
    ? await pageWhere(projects, options)
    : await listWhere(projects);
  const rows = await deps.db
    .select({
      slug: projects.slug,
      title: projects.title,
    })
    .from(userProjects)
    .innerJoin(projects, eq(userProjects.projectId, projects.id))
    .where(and(eq(userProjects.userId, userId), visibility))
    .orderBy(asc(projects.title));

  return uniqueRelatedLinks(rows);
}

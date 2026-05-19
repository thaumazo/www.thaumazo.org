import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere, pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { projects, userProjects } from "@/modules/projects/tables";
import { uniqueRelatedLinks } from "@/modules/siteContent";

type RelatedQueryOptions = {
  preview?: boolean;
};

export function listUserProjects(
  userId: number,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  return preview
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
  const { preview = false } = options;
  const visibility = preview
    ? await pageWhere(projects, options)
    : listWhere(projects);
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

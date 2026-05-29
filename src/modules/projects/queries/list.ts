import { selectImageSubquery } from "@kenstack/db/tables";
import { and, asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere, pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { projectOrganizations, projects, userProjects } from "../tables";

type ListProjectsOptions = {
  organizationId?: number;
  draft?: boolean;
  userId?: number;
  order?: "title" | "recent";
};

const projectListSelect = {
  id: projects.id,
  title: projects.title,
  slug: projects.slug,
  image: selectImageSubquery(projects.image, "square"),
  description: projects.description,
  location: projects.location,
  status: projects.status,
  kind: projects.kind,
  sdgs: projects.sdgs,
};

function uniqueProjectRows<TProject extends { id: number }>(rows: TProject[]) {
  return Array.from(
    rows
      .reduce((unique, row) => {
        if (!unique.has(row.id)) {
          unique.set(row.id, row);
        }

        return unique;
      }, new Map<number, TProject>())
      .values(),
  );
}

export function listProjects(options: ListProjectsOptions = {}) {
  const { draft = false, ...cacheOptions } = options;
  return draft ? loadProjects(options) : loadCachedProjects(cacheOptions);
}

async function loadCachedProjects(options: ListProjectsOptions) {
  "use cache";
  cacheLife("hours");
  cacheTag(
    "projects",
    ...(options.organizationId ? ["organizations"] : []),
    ...(options.userId ? ["community"] : []),
  );

  return loadProjects(options);
}

async function loadProjects({
  organizationId,
  userId,
  draft = false,
  order = "title",
}: ListProjectsOptions = {}) {
  const visibility = draft
    ? await pageWhere(projects, { draft })
    : await listWhere(projects);
  const orderBy =
    order === "recent"
      ? [desc(projects.publishedAt), desc(projects.id)]
      : [asc(projects.title)];

  if (userId) {
    const rows = await deps.db
      .select(projectListSelect)
      .from(userProjects)
      .innerJoin(projects, eq(userProjects.projectId, projects.id))
      .where(
        and(
          eq(userProjects.userId, userId),
          eq(userProjects.relationship, "liaison"),
          visibility,
        ),
      )
      .orderBy(...orderBy);

    return uniqueProjectRows(rows);
  }

  if (organizationId) {
    const rows = await deps.db
      .select(projectListSelect)
      .from(projectOrganizations)
      .innerJoin(projects, eq(projectOrganizations.projectId, projects.id))
      .where(
        and(
          eq(projectOrganizations.organizationId, organizationId),
          eq(projectOrganizations.relationship, "organization"),
          visibility,
        ),
      )
      .orderBy(...orderBy);

    return uniqueProjectRows(rows);
  }

  return deps.db
    .select(projectListSelect)
    .from(projects)
    .where(visibility)
    .orderBy(...orderBy);
}

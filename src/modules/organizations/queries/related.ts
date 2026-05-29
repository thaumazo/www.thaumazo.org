import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere, pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { projectOrganizations, projects } from "@/modules/projects/tables";
import { uniqueRelatedLinks } from "@/modules/siteContent";
import { users } from "@/modules/users/tables";
import { userOrganizations } from "../tables";

type RelatedQueryOptions = {
  draft?: boolean;
};

const userLabel = {
  id: users.id,
  slug: users.slug,
  title: users.title,
  givenName: users.givenName,
  familyName: users.familyName,
  email: users.email,
};

function getUserTitle(user: {
  title: string;
  givenName: string;
  familyName: string;
  email: string;
}) {
  const name = [user.givenName, user.familyName].filter(Boolean).join(" ");
  return user.title || name || user.email;
}

export function listOrganizationUsers(
  organizationId: number,
  relationship: string,
  options: RelatedQueryOptions = {},
) {
  const { draft = false } = options;
  return draft
    ? loadOrganizationUsers(organizationId, relationship, options)
    : loadCachedOrganizationUsers(organizationId, relationship);
}

async function loadCachedOrganizationUsers(
  organizationId: number,
  relationship: string,
) {
  "use cache";
  cacheLife("hours");
  cacheTag("organizations", "community");

  return loadOrganizationUsers(organizationId, relationship);
}

async function loadOrganizationUsers(
  organizationId: number,
  relationship: string,
  options: RelatedQueryOptions = {},
) {
  const { draft = false } = options;
  const visibility = draft
    ? await pageWhere(users, options)
    : await listWhere(users);
  const rows = await deps.db
    .select(userLabel)
    .from(userOrganizations)
    .innerJoin(users, eq(userOrganizations.userId, users.id))
    .where(
      and(
        eq(userOrganizations.organizationId, organizationId),
        eq(userOrganizations.relationship, relationship),
        visibility,
      ),
    )
    .orderBy(asc(users.familyName), asc(users.givenName), asc(users.email));

  return rows.map((row) => ({
    slug: row.slug,
    title: getUserTitle(row),
  }));
}

export function listOrganizationProjects(
  organizationId: number,
  options: RelatedQueryOptions = {},
) {
  const { draft = false } = options;
  return draft
    ? loadOrganizationProjects(organizationId, options)
    : loadCachedOrganizationProjects(organizationId);
}

async function loadCachedOrganizationProjects(organizationId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("organizations", "projects");

  return loadOrganizationProjects(organizationId);
}

async function loadOrganizationProjects(
  organizationId: number,
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
    .from(projectOrganizations)
    .innerJoin(projects, eq(projectOrganizations.projectId, projects.id))
    .where(
      and(
        eq(projectOrganizations.organizationId, organizationId),
        visibility,
      ),
    )
    .orderBy(asc(projects.title));

  return uniqueRelatedLinks(rows);
}

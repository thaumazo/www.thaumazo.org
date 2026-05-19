import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere, pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import {
  organizations,
  userOrganizations,
} from "@/modules/organizations/tables";
import { uniqueRelatedLinks } from "@/modules/siteContent";
import { users } from "@/modules/users/tables";
import { projectOrganizations, projects, userProjects } from "../tables";

type RelatedQueryOptions = {
  preview?: boolean;
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

export function listProjectUsers(
  projectId: number,
  relationship: string,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  return preview
    ? loadProjectUsers(projectId, relationship, options)
    : loadCachedProjectUsers(projectId, relationship);
}

async function loadCachedProjectUsers(
  projectId: number,
  relationship: string,
) {
  "use cache";
  cacheLife("hours");
  cacheTag("projects", "community");

  return loadProjectUsers(projectId, relationship);
}

async function loadProjectUsers(
  projectId: number,
  relationship: string,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  const visibility = preview
    ? await pageWhere(users, options)
    : listWhere(users);
  const rows = await deps.db
    .select(userLabel)
    .from(userProjects)
    .innerJoin(users, eq(userProjects.userId, users.id))
    .where(
      and(
        eq(userProjects.projectId, projectId),
        eq(userProjects.relationship, relationship),
        visibility,
      ),
    )
    .orderBy(asc(users.familyName), asc(users.givenName), asc(users.email));

  return rows.map((row) => ({
    slug: row.slug,
    title: getUserTitle(row),
  }));
}

export function listProjectOrganizations(
  projectId: number,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  return preview
    ? loadProjectOrganizations(projectId, options)
    : loadCachedProjectOrganizations(projectId);
}

async function loadCachedProjectOrganizations(projectId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("projects", "organizations");

  return loadProjectOrganizations(projectId);
}

async function loadProjectOrganizations(
  projectId: number,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  const visibility = preview
    ? await pageWhere(organizations, options)
    : listWhere(organizations);
  const rows = await deps.db
    .select({
      slug: organizations.slug,
      title: organizations.title,
    })
    .from(projectOrganizations)
    .innerJoin(
      organizations,
      eq(projectOrganizations.organizationId, organizations.id),
    )
    .where(
      and(
        eq(projectOrganizations.projectId, projectId),
        eq(projectOrganizations.relationship, "organization"),
        visibility,
      ),
    )
    .orderBy(asc(organizations.title));

  return uniqueRelatedLinks(rows);
}

export function listRelatedProjectsForUser(
  userId: number,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  return preview
    ? loadRelatedProjectsForUser(userId, options)
    : loadCachedRelatedProjectsForUser(userId);
}

async function loadCachedRelatedProjectsForUser(userId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("community", "projects");

  return loadRelatedProjectsForUser(userId);
}

async function loadRelatedProjectsForUser(
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
    .where(
      and(
        eq(userProjects.userId, userId),
        eq(userProjects.relationship, "liaison"),
        visibility,
      ),
    )
    .orderBy(asc(projects.title));

  return uniqueRelatedLinks(rows);
}

export function listRelatedProjectsForOrganization(
  organizationId: number,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  return preview
    ? loadRelatedProjectsForOrganization(organizationId, options)
    : loadCachedRelatedProjectsForOrganization(organizationId);
}

async function loadCachedRelatedProjectsForOrganization(organizationId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("organizations", "projects");

  return loadRelatedProjectsForOrganization(organizationId);
}

async function loadRelatedProjectsForOrganization(
  organizationId: number,
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
    .from(projectOrganizations)
    .innerJoin(projects, eq(projectOrganizations.projectId, projects.id))
    .where(
      and(
        eq(projectOrganizations.organizationId, organizationId),
        eq(projectOrganizations.relationship, "organization"),
        visibility,
      ),
    )
    .orderBy(asc(projects.title));

  return uniqueRelatedLinks(rows);
}

export function listProjectOrganizationsForUser(
  userId: number,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  return preview
    ? loadProjectOrganizationsForUser(userId, options)
    : loadCachedProjectOrganizationsForUser(userId);
}

async function loadCachedProjectOrganizationsForUser(userId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("community", "organizations");

  return loadProjectOrganizationsForUser(userId);
}

async function loadProjectOrganizationsForUser(
  userId: number,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  const visibility = preview
    ? await pageWhere(organizations, options)
    : listWhere(organizations);
  const rows = await deps.db
    .select({
      slug: organizations.slug,
      title: organizations.title,
    })
    .from(userOrganizations)
    .innerJoin(
      organizations,
      eq(userOrganizations.organizationId, organizations.id),
    )
    .where(and(eq(userOrganizations.userId, userId), visibility))
    .orderBy(asc(organizations.title));

  return uniqueRelatedLinks(rows);
}

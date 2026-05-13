import { selectImageSubquery } from "@kenstack/db/tables";
import { and, asc, eq, isNull, lte, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { deps } from "@app/deps";
import { projectOrganizations, projects } from "@/modules/projects/tables";
import { toSiteImage, uniqueRelatedLinks } from "@/modules/siteContent";
import { users } from "@/modules/users/tables";
import { organizations, userOrganizations } from "./tables";

function listedOrganizationsWhere() {
  return and(
    isNull(organizations.deletedAt),
    eq(organizations.draft, false),
    lte(organizations.publishedAt, sql`now()`),
  );
}

function pageOrganizationsWhere() {
  return isNull(organizations.deletedAt);
}

function relatedProjectsWhere() {
  return and(isNull(projects.deletedAt), lte(projects.publishedAt, sql`now()`));
}

function relatedUsersWhere() {
  return and(isNull(users.deletedAt), lte(users.publishedAt, sql`now()`));
}

const userLabel = {
  id: users.id,
  slug: users.slug,
  title: users.title,
  givenName: users.givenName,
  familyName: users.familyName,
  email: users.email,
  draft: users.draft,
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

export async function listOrganizations() {
  "use cache";
  cacheLife("hours");
  cacheTag("organizations");

  const rows = await deps.db
    .select({
      id: organizations.id,
      title: organizations.title,
      slug: organizations.slug,
      image: selectImageSubquery(organizations.image, "square"),
      description: organizations.description,
      kind: organizations.kind,
      sdgs: organizations.sdgs,
    })
    .from(organizations)
    .where(listedOrganizationsWhere())
    .orderBy(asc(organizations.title));

  return rows.map((row) => ({
    ...row,
    image: toSiteImage(row.image),
  }));
}

export async function getOrganization(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`organizations:${slug}`);

  const [row] = await deps.db
    .select({
      id: organizations.id,
      title: organizations.title,
      slug: organizations.slug,
      image: selectImageSubquery(organizations.image, "original"),
      description: organizations.description,
      content: organizations.content,
      url: organizations.url,
      kind: organizations.kind,
      sdgs: organizations.sdgs,
      seoTitle: organizations.seoTitle,
      seoDescription: organizations.seoDescription,
    })
    .from(organizations)
    .where(and(eq(organizations.slug, slug), pageOrganizationsWhere()))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    ...row,
    image: toSiteImage(row.image),
  };
}

export async function listOrganizationUsers(
  organizationId: number,
  relationship: string,
) {
  const rows = await deps.db
    .select(userLabel)
    .from(userOrganizations)
    .innerJoin(users, eq(userOrganizations.userId, users.id))
    .where(
      and(
        eq(userOrganizations.organizationId, organizationId),
        eq(userOrganizations.relationship, relationship),
        relatedUsersWhere(),
      ),
    )
    .orderBy(asc(users.familyName), asc(users.givenName), asc(users.email));

  return rows.map((row) => ({
    slug: row.slug,
    title: getUserTitle(row),
    draft: row.draft,
  }));
}

export async function listOrganizationProjects(organizationId: number) {
  const rows = await deps.db
    .select({
      slug: projects.slug,
      title: projects.title,
      draft: projects.draft,
    })
    .from(projectOrganizations)
    .innerJoin(projects, eq(projectOrganizations.projectId, projects.id))
    .where(
      and(
        eq(projectOrganizations.organizationId, organizationId),
        relatedProjectsWhere(),
      ),
    )
    .orderBy(asc(projects.title));

  return uniqueRelatedLinks(rows);
}

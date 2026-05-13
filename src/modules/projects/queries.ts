import { selectImageSubquery } from "@kenstack/db/tables";
import { and, asc, desc, eq, isNull, lte, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { deps } from "@app/deps";
import {
  organizations,
  userOrganizations,
} from "@/modules/organizations/tables";
import { toSiteImage, uniqueRelatedLinks } from "@/modules/siteContent";
import { users } from "@/modules/users/tables";
import { projectOrganizations, projects, userProjects } from "./tables";

function listedProjectsWhere() {
  return and(
    isNull(projects.deletedAt),
    eq(projects.draft, false),
    lte(projects.publishedAt, sql`now()`),
  );
}

function relatedProjectsWhere() {
  return and(isNull(projects.deletedAt), lte(projects.publishedAt, sql`now()`));
}

function pageProjectsWhere() {
  return isNull(projects.deletedAt);
}

function relatedOrganizationsWhere() {
  return and(
    isNull(organizations.deletedAt),
    lte(organizations.publishedAt, sql`now()`),
  );
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

type ListProjectsOptions = {
  organizationId?: number;
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

export async function listProjects({
  organizationId,
  userId,
  order = "title",
}: ListProjectsOptions = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  const orderBy =
    order === "recent"
      ? [desc(projects.publishedAt), desc(projects.id)]
      : [asc(projects.title)];

  if (userId) {
    const rows = await deps.db
      .select(projectListSelect)
      .from(userProjects)
      .innerJoin(projects, eq(userProjects.projectId, projects.id))
      .where(and(eq(userProjects.userId, userId), listedProjectsWhere()))
      .orderBy(...orderBy);

    return rows.map((row) => ({
      ...row,
      image: toSiteImage(row.image),
    }));
  }

  if (organizationId) {
    const rows = await deps.db
      .select(projectListSelect)
      .from(projectOrganizations)
      .innerJoin(projects, eq(projectOrganizations.projectId, projects.id))
      .where(
        and(
          eq(projectOrganizations.organizationId, organizationId),
          listedProjectsWhere(),
        ),
      )
      .orderBy(...orderBy);

    return rows.map((row) => ({
      ...row,
      image: toSiteImage(row.image),
    }));
  }

  const rows = await deps.db
    .select(projectListSelect)
    .from(projects)
    .where(listedProjectsWhere())
    .orderBy(...orderBy);

  return rows.map((row) => ({
    ...row,
    image: toSiteImage(row.image),
  }));
}

export async function getProject(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`projects:${slug}`);

  const [row] = await deps.db
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
      seoTitle: projects.seoTitle,
      seoDescription: projects.seoDescription,
    })
    .from(projects)
    .where(and(eq(projects.slug, slug), pageProjectsWhere()))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    ...row,
    image: toSiteImage(row.image),
  };
}

export async function listProjectUsers(
  projectId: number,
  relationship: string,
) {
  const rows = await deps.db
    .select(userLabel)
    .from(userProjects)
    .innerJoin(users, eq(userProjects.userId, users.id))
    .where(
      and(
        eq(userProjects.projectId, projectId),
        eq(userProjects.relationship, relationship),
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

export async function listProjectOrganizations(projectId: number) {
  const rows = await deps.db
    .select({
      slug: organizations.slug,
      title: organizations.title,
      draft: organizations.draft,
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
        relatedOrganizationsWhere(),
      ),
    )
    .orderBy(asc(organizations.title));

  return uniqueRelatedLinks(rows);
}

export async function listRelatedProjectsForUser(userId: number) {
  const rows = await deps.db
    .select({
      slug: projects.slug,
      title: projects.title,
      draft: projects.draft,
    })
    .from(userProjects)
    .innerJoin(projects, eq(userProjects.projectId, projects.id))
    .where(and(eq(userProjects.userId, userId), relatedProjectsWhere()))
    .orderBy(asc(projects.title));

  return uniqueRelatedLinks(rows);
}

export async function listRelatedProjectsForOrganization(
  organizationId: number,
) {
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

export async function listProjectOrganizationsForUser(userId: number) {
  const rows = await deps.db
    .select({
      slug: organizations.slug,
      title: organizations.title,
      draft: organizations.draft,
    })
    .from(userOrganizations)
    .innerJoin(
      organizations,
      eq(userOrganizations.organizationId, organizations.id),
    )
    .where(
      and(eq(userOrganizations.userId, userId), relatedOrganizationsWhere()),
    )
    .orderBy(asc(organizations.title));

  return uniqueRelatedLinks(rows);
}

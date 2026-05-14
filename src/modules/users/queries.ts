import { selectImageSubquery } from "@kenstack/db/tables";
import { and, asc, eq, isNull, lte, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { deps } from "@app/deps";
import { projects, userProjects } from "@/modules/projects/tables";
import { toSiteImage, uniqueRelatedLinks } from "@/modules/siteContent";
import { users } from "@/modules/users/tables";

function userTitle(user: {
  title: string;
  givenName: string;
  familyName: string;
  email: string;
}) {
  const name = [user.givenName, user.familyName].filter(Boolean).join(" ");
  return user.title || name || user.email;
}

function listedUsersWhere() {
  return and(
    isNull(users.deletedAt),
    eq(users.draft, false),
    lte(users.publishedAt, sql`now()`),
  );
}

function pageUsersWhere() {
  return isNull(users.deletedAt);
}

function relatedProjectsWhere() {
  return and(isNull(projects.deletedAt), lte(projects.publishedAt, sql`now()`));
}

export async function listCommunityUsers() {
  "use cache";
  cacheLife("hours");
  cacheTag("community");

  const rows = await deps.db
    .select({
      id: users.id,
      slug: users.slug,
      title: users.title,
      givenName: users.givenName,
      familyName: users.familyName,
      email: users.email,
      image: selectImageSubquery(users.avatar, "square"),
      description: users.description,
      content: users.content,
      roles: users.communityRoles,
    })
    .from(users)
    .where(listedUsersWhere())
    .orderBy(asc(users.title));

  return rows.map((row) => ({
    ...row,
    title: userTitle(row),
    image: toSiteImage(row.image),
  }));
}

export async function getCommunityUser(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`community:${slug}`);

  const [row] = await deps.db
    .select({
      id: users.id,
      slug: users.slug,
      title: users.title,
      givenName: users.givenName,
      familyName: users.familyName,
      email: users.email,
      image: selectImageSubquery(users.avatar, "original"),
      description: users.description,
      content: users.content,
      linkedin: users.linkedin,
      roles: users.communityRoles,
      seoTitle: users.seoTitle,
      seoDescription: users.seoDescription,
    })
    .from(users)
    .where(and(eq(users.slug, slug), pageUsersWhere()))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    ...row,
    title: userTitle(row),
    image: toSiteImage(row.image),
  };
}

export async function listUserProjects(userId: number) {
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

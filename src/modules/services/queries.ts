import { selectImageSubquery } from "@kenstack/db/tables";
import { and, asc, eq, isNull, lte, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { deps } from "@app/deps";
import { toSiteImage } from "@/modules/siteContent";
import { users } from "@/modules/users/tables";
import { services, userServices } from "./tables";

function listedServicesWhere() {
  return and(
    isNull(services.deletedAt),
    eq(services.draft, false),
    lte(services.publishedAt, sql`now()`),
  );
}

function pageServicesWhere() {
  return isNull(services.deletedAt);
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

export async function listServices() {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  const rows = await deps.db
    .select({
      id: services.id,
      title: services.title,
      slug: services.slug,
      image: selectImageSubquery(services.image, "square"),
      description: services.description,
    })
    .from(services)
    .where(listedServicesWhere())
    .orderBy(asc(services.title));

  return rows.map((row) => ({
    ...row,
    image: toSiteImage(row.image),
  }));
}

export async function getService(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`services:${slug}`);

  const [row] = await deps.db
    .select({
      id: services.id,
      title: services.title,
      slug: services.slug,
      image: selectImageSubquery(services.image, "original"),
      description: services.description,
      content: services.content,
      seoTitle: services.seoTitle,
      seoDescription: services.seoDescription,
    })
    .from(services)
    .where(and(eq(services.slug, slug), pageServicesWhere()))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    ...row,
    image: toSiteImage(row.image),
  };
}

export async function listServiceUsers(
  serviceId: number,
  relationship: string,
) {
  const rows = await deps.db
    .select(userLabel)
    .from(userServices)
    .innerJoin(users, eq(userServices.userId, users.id))
    .where(
      and(
        eq(userServices.serviceId, serviceId),
        eq(userServices.relationship, relationship),
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

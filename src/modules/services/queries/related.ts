import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere, pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { users } from "@/modules/users/tables";
import { userServices } from "../tables";

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

export function listServiceUsers(
  serviceId: number,
  relationship: string,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  return preview
    ? loadServiceUsers(serviceId, relationship, options)
    : loadCachedServiceUsers(serviceId, relationship);
}

async function loadCachedServiceUsers(
  serviceId: number,
  relationship: string,
) {
  "use cache";
  cacheLife("hours");
  cacheTag("services", "community");

  return loadServiceUsers(serviceId, relationship);
}

async function loadServiceUsers(
  serviceId: number,
  relationship: string,
  options: RelatedQueryOptions = {},
) {
  const { preview = false } = options;
  const visibility = preview
    ? await pageWhere(users, options)
    : listWhere(users);
  const rows = await deps.db
    .select(userLabel)
    .from(userServices)
    .innerJoin(users, eq(userServices.userId, users.id))
    .where(
      and(
        eq(userServices.serviceId, serviceId),
        eq(userServices.relationship, relationship),
        visibility,
      ),
    )
    .orderBy(asc(users.familyName), asc(users.givenName), asc(users.email));

  return rows.map((row) => ({
    slug: row.slug,
    title: getUserTitle(row),
  }));
}

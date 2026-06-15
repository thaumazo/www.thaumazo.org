import { selectMediaSubquery } from "@kenstack/db/tables";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
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

export async function listCommunityUsers() {
  "use cache";
  cacheLife("hours");
  cacheTag("community");

  const visibility = await listWhere(users);

  const rows = await deps.db
    .select({
      id: users.id,
      slug: users.slug,
      title: users.title,
      givenName: users.givenName,
      familyName: users.familyName,
      email: users.email,
      image: selectMediaSubquery(users.avatar, "square"),
      description: users.description,
      content: users.content,
      roles: users.communityRoles,
    })
    .from(users)
    .where(visibility)
    .orderBy(asc(users.title));

  return rows.map((row) => ({
    ...row,
    title: userTitle(row),
  }));
}

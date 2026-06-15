import { selectMediaSubquery } from "@kenstack/db/tables";
import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { metaSelect } from "@kenstack/admin";
import { pageWhere } from "@kenstack/admin/queries";
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

export function getCommunityUser(
  slug: string,
  options: { draft?: boolean } = {},
) {
  return options.draft
    ? loadCommunityUser(slug, options)
    : loadCachedCommunityUser(slug);
}

async function loadCachedCommunityUser(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("community", `community:${slug}`);

  return loadCommunityUser(slug);
}

async function loadCommunityUser(
  slug: string,
  options: { draft?: boolean } = {},
) {
  const visibility = await pageWhere(users, options);
  const [row] = await deps.db
    .select({
      id: users.id,
      slug: users.slug,
      title: users.title,
      givenName: users.givenName,
      familyName: users.familyName,
      email: users.email,
      image: selectMediaSubquery(users.avatar, "original"),
      description: users.description,
      content: users.content,
      linkedin: users.linkedin,
      roles: users.communityRoles,
      ...metaSelect(users),
    })
    .from(users)
    .where(and(visibility, eq(users.slug, slug)))
    .limit(1);

  return row
    ? {
        ...row,
        title: userTitle(row),
      }
    : null;
}

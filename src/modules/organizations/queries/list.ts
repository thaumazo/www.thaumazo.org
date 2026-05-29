import { selectImageSubquery } from "@kenstack/db/tables";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { organizations } from "../tables";

export async function listOrganizations() {
  "use cache";
  cacheLife("hours");
  cacheTag("organizations");

  const visibility = await listWhere(organizations);

  return deps.db
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
    .where(visibility)
    .orderBy(asc(organizations.title));
}

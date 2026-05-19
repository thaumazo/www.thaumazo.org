import { selectImageSubquery } from "@kenstack/db/tables";
import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { metaSelect } from "@kenstack/admin";
import { pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { organizations } from "../tables";

export function getOrganization(
  slug: string,
  options: { preview?: boolean } = {},
) {
  return options.preview
    ? loadOrganization(slug, options)
    : loadCachedOrganization(slug);
}

async function loadCachedOrganization(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("organizations", `organizations:${slug}`);

  return loadOrganization(slug);
}

async function loadOrganization(
  slug: string,
  options: { preview?: boolean } = {},
) {
  const visibility = await pageWhere(organizations, options);
  const [organization] = await deps.db
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
      ...metaSelect(organizations),
    })
    .from(organizations)
    .where(and(visibility, eq(organizations.slug, slug)))
    .limit(1);

  return organization ?? null;
}

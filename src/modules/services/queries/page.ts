import { selectImageSubquery } from "@kenstack/db/tables";
import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { metaSelect } from "@kenstack/admin";
import { pageWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { services } from "../tables";

export function getService(slug: string, options: { draft?: boolean } = {}) {
  return options.draft ? loadService(slug, options) : loadCachedService(slug);
}

async function loadCachedService(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("services", `services:${slug}`);

  return loadService(slug);
}

async function loadService(slug: string, options: { draft?: boolean } = {}) {
  const visibility = await pageWhere(services, options);
  const [service] = await deps.db
    .select({
      id: services.id,
      title: services.title,
      slug: services.slug,
      image: selectImageSubquery(services.image, "original"),
      description: services.description,
      content: services.content,
      ...metaSelect(services),
    })
    .from(services)
    .where(and(visibility, eq(services.slug, slug)))
    .limit(1);

  return service ?? null;
}

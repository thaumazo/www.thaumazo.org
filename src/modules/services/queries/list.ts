import { selectMediaSubquery } from "@kenstack/db/tables";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { listWhere } from "@kenstack/admin/queries";
import { deps } from "@app/deps";
import { services } from "../tables";

export async function listServices() {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  const visibility = await listWhere(services);

  return deps.db
    .select({
      id: services.id,
      title: services.title,
      slug: services.slug,
      image: selectMediaSubquery(services.image, "square"),
      description: services.description,
    })
    .from(services)
    .where(visibility)
    .orderBy(asc(services.title));
}

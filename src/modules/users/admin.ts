import { adminTable } from "@kenstack/admin";
import { userAdminTableOptions } from "@kenstack/modules/users/admin";
import { selectImageSubquery } from "@kenstack/db/tables";

import { client } from "./client";
import { fields } from "./fields";
import { relationships } from "./relationships";
import { users } from "./tables";

const config = adminTable({
  ...userAdminTableOptions,
  client,
  fields,
  relationships,
  table: users,
  preview: "/community/${slug}",
  revalidate: ["community", ({ slug }) => `community:${slug}`],
  select: {
    givenName: users.givenName,
    familyName: users.familyName,
    email: users.email,
    avatar: selectImageSubquery(users.avatar, "square"),
    title: users.title,
    slug: users.slug,
  },
});

export default config;

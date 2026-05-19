import { adminConfig } from "@kenstack/admin";
import { userAdminConfigOptions } from "@kenstack/modules/users/admin";
import { selectImageSubquery } from "@kenstack/db/tables";
import roles from "@app/deps/roles";

import { client } from "./client";
import { communityRoleOptions, fields } from "./fields";
import { relationships } from "./relationships";
import { users } from "./tables";

const config = adminConfig({
  ...userAdminConfigOptions,
  client,
  fields,
  relationships,
  table: users,
  preview: "/community/${slug}",
  revalidate: ["community", ({ slug }) => `community:${slug}`],
  sort: {
    name: {
      fields: [users.visibility, users.familyName, users.givenName],
      defaultDirection: "asc",
    },
  },
  filters: {
    publishedAt: {
      field: users.publishedAt,
      kind: "date-range",
      label: "Published",
    },
    givenName: {
      field: users.givenName,
      kind: "text",
      label: "Given Name",
    },
    familyName: {
      field: users.familyName,
      kind: "text",
      label: "Family Name",
    },
    email: {
      field: users.email,
      kind: "text",
    },
    roles: {
      field: users.roles,
      kind: "includes",
      label: "Access Roles",
      options: roles,
    },
    communityRoles: {
      field: users.communityRoles,
      kind: "includes",
      options: communityRoleOptions,
    },
  },

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

import { UsersRound } from "lucide-react";

import { defineModule } from "@kenstack/admin";
import roles from "@app/deps/roles";

import { client } from "./client";
import { communityRoleOptions, fields } from "./fields";
import { users } from "./tables";

const config = defineModule({
  name: "users",
  title: "Users",
  icon: UsersRound,
  client,
  admin: {
    fields,
    table: users,
    preview: "/community/${slug}",
    revalidate: ["community", ({ slug }) => `community:${slug}`],
    list: {
      sort: {
        name: {
          fields: ["visibility", "familyName", "givenName"],
          defaultDirection: "asc",
        },
      },
      filters: {
        publishedAt: {
          field: "publishedAt",
          kind: "date-range",
          label: "Published",
        },
        givenName: {
          field: "givenName",
          kind: "text",
          label: "Given Name",
        },
        familyName: {
          field: "familyName",
          kind: "text",
          label: "Family Name",
        },
        email: {
          field: "email",
          kind: "text",
        },
        roles: {
          field: "roles",
          kind: "includes",
          label: "Access Roles",
          options: roles,
        },
        communityRoles: {
          field: "communityRoles",
          kind: "includes",
          options: communityRoleOptions,
        },
      },
    },
  },
});

export default config;

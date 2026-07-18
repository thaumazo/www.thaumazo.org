"use client";

import { defineAdminClients } from "@kenstack/admin/clientLoaders";

export const clients = defineAdminClients({
  blog: () => import("./blog/client"),
  contact: () => import("./contact/client"),
  organizations: () => import("./organizations/client"),
  projects: () => import("./projects/client"),
  services: () => import("./services/client"),
  "site-settings": () => import("@kenstack/modules/siteSettings/client"),
  users: () => import("./users/client"),
});

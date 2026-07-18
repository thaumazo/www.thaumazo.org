import "server-only";

import { defineAdmin } from "@kenstack/admin/server";
import siteSettings from "@kenstack/modules/siteSettings";
import users from "./users/admin";
import projects from "./projects/admin";
import organizations from "./organizations/admin";
import services from "./services/admin";
import { blog } from "./blog";
import { contact } from "./contact";
import { clients } from "./clients";

export const modules = defineAdmin(
  [users, siteSettings, blog, projects, organizations, services, contact],
  clients,
);

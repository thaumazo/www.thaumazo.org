import users from "./users/admin";
import projects from "./projects/admin";
import organizations from "./organizations/admin";
import services from "./services/admin";
import { blog } from "./blog";
import { contact } from "./contact";
import siteSettings from "@kenstack/modules/siteSettings";

import type { DefinedAdmin } from "@kenstack/admin";

export const modules = {
  siteSettings,
  users,
  blog,
  projects,
  organizations,
  services,
  contact,
} satisfies DefinedAdmin;

import users from "./users/admin";
import projects from "./projects/admin";
import organizations from "./organizations/admin";
import services from "./services/admin";
import { blog } from "./blog";
import { contact } from "./contact";

import type { DefinedAdmin } from "@kenstack/admin";

export const admin = {
  users,
  blog,
  projects,
  organizations,
  services,
  contact,
} satisfies DefinedAdmin;

export default admin;

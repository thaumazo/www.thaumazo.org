import users from "./users/admin";
import projects from "./projects/admin";
import organizations from "./organizations/admin";
import services from "./services/admin";
import { blog } from "./blog";

import { defineAdmin } from "@kenstack/admin";

export const admin = defineAdmin({
  modules: {
    users,
    blog: blog.admin,
    projects,
    organizations,
    services,
  },
});

export default admin;

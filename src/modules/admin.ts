import users from "./users/admin";
import blog from "@kenstack/modules/blog/admin";
import projects from "./projects/admin";
import organizations from "./organizations/admin";
import services from "./services/admin";

import { defineAdmin } from "@kenstack/admin";

export const admin = defineAdmin({
  modules: {
    users,
    blog,
    projects,
    organizations,
    services,
  },
});

export default admin;

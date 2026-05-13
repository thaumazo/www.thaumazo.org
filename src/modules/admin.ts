import users from "./users/admin";
import blog from "./blog/admin";
import projects from "./projects/admin";
import organizations from "./organizations/admin";
import services from "./services/admin";

import { adminConfig } from "@kenstack/admin";
export const config = adminConfig([
  ["users", users],
  ["blog", blog],
  ["projects", projects],
  ["organizations", organizations],
  ["services", services],
]);
export default config;

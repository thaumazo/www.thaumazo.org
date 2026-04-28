import users from "@kenstack/modules/users/admin";
import blog from "./blog/admin";

import { adminConfig } from "@kenstack/admin";
export const config = adminConfig([
  ["users", users],
  ["blog", blog],
]);
export default config;

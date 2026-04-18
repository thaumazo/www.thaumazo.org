// import users from "./users/server/admin";
import blog from './blog/admin';

import { adminConfig } from '@kenstack/admin';
export const config = adminConfig([
  // ["users", users],
  ['blog', blog],
]);
export default config;

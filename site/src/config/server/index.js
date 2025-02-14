import Session from "@kenstack/server/Session";
import User from "./models/User";

export const session = new Session(User);


export const models = new Map([
  ['User', () => import('./models/User')], 
  ['Project', () => import('./models/Project')], 
]);

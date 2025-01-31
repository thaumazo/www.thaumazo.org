
import Session from "@kenstack/server/Session";
import User from "./models/User";

const session = new Session(User);

export { session };

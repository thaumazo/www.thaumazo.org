import API from "@kenstack/modules/ForgottenPassword/api";
import { session } from "@/config/server";

import Email from "./Email";

export const { POST, GET } = API(session, {
  Email: Email,
  from: "ken@thaumazo.org",
});

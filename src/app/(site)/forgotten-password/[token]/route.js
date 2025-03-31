import API from "@kenstack/modules/ForgottenPassword/api/tokenHandler";
import { session } from "@/config/server";

export const { GET } = API(session);

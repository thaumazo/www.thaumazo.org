import { session } from "@/config/server";

import API from "@kenstack/modules/ResetPassword/api";

export const { POST } = API(session);

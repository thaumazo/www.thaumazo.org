import { session } from "@/config/server";

import API from "@kenstack/modules/Login/api";

export const { POST } = API(session);

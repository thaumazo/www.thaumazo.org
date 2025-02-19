import API from "@kenstack/modules/Admin/api";

// import config from "../../config";

import * as client from "@/config/client";
import * as server from "@/config/server";

export const { GET, POST } = API({ ...client, ...server });

import Router from "@kenstack/modules/Admin/Router";
import AdminClient from "./Client";
// import config from "../config";

import * as client from "@/config/client";
import * as server from "@/config/server";

export default function AdminPage(props) {
  return <Router {...client} {...server} {...props} client={AdminClient} />;
}

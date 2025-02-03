import Router from "@kenstack/modules/Admin/Router";
import AdminClient from "./Client";
import config from "../config";

export default function AdminPage(props) {
  return <Router {...config} {...props} client={AdminClient} />;
}

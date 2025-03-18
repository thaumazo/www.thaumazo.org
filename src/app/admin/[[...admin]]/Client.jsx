"use client";

import Client from "@kenstack/modules/Admin/Client";
import * as config from "@/config/client";

export default function AdminClient(props) {
  return <Client {...config} {...props} />;
}

"use client";

import admin from "@/config/client/models/User";
import Client from "@kenstack/modules/Admin/Client";

export default function AdminClient() {
  return <Client admin={admin} />;
}

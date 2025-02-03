"use client";

import admin from "../admin";
import Client from "@kenstack/modules/Admin/Client";

export default function AdminClient() {
  return <Client admin={admin} />;
}

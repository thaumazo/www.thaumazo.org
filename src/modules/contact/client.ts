"use client";

import { defineClient } from "@kenstack/admin";

import { settingsFields } from "./fields";

export const client = defineClient({
  settings: {
    fields: settingsFields,
  },
});

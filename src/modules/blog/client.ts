"use client";

import { defineClient } from "@kenstack/admin";
import { BlogForm } from "./components/EditForm";
import { fields } from "./fields";

export const client = defineClient({
  admin: {
    fields,
    EditForm: BlogForm,
  },
});

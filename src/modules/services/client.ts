"use client";

import { defineClient } from "@kenstack/admin/client";
import EditForm from "./components/EditForm";
import { fields } from "./fields";

export default defineClient({
  admin: {
    fields,
    EditForm,
  },
});

"use client";

import { defineClient } from "@kenstack/admin/client";
import { fields } from "./fields";
import EditForm from "./components/EditForm";

export default defineClient({
  admin: {
    fields,
    EditForm,
  },
});

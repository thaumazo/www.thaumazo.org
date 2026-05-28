import { text } from "drizzle-orm/pg-core";

import { defineKeyTable } from "@kenstack/admin/table";

export const contactSettings = defineKeyTable({
  name: "contact_settings",
  columns: {
    to: text("to").notNull(),
    subject: text("subject").notNull(),
  },
});

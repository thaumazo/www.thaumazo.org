import { defineModule } from "@kenstack/admin";
import { client } from "./client";

import { settingsFields } from "./fields";
import { contactSettings as settingsTable } from "./tables";
import { Mail } from "lucide-react";

export const contact = defineModule({
  name: "contact",
  icon: Mail,
  client,
  settings: {
    table: settingsTable,
    fields: settingsFields,
    cacheTag: "module-settings:contact",
  },
});

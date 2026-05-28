import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { deps } from "@app/deps";
import { contactSettings } from "@/modules/contact/tables";
import { settingsFields } from "@/modules/contact/fields";

export async function loadContactSettings() {
  "use cache";
  cacheTag("module-settings:contact");
  cacheLife("max");

  const [settings] = await deps.db
    .select({
      to: contactSettings.to,
      subject: contactSettings.subject,
    })
    .from(contactSettings)
    .where(eq(contactSettings.key, "contact"))
    .limit(1);

  return {
    to: settings?.to ?? settingsFields.to.default,
    subject: settings?.subject ?? settingsFields.subject.default,
  };
}

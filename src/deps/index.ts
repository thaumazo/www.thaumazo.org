import { createDeps } from "@kenstack/deps";
import EmailCont, { attachments } from "@/email/Email";

import * as tables from "@/tables";

const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://thaumazo.org"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const deps = createDeps({
  tables,
  siteUrl,
  email: {
    EmailCont,
    attachments,
  },
});

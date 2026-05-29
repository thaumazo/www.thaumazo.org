import SiteShell from "@/components/SiteShell";
import { loadSiteSettingsMetadata } from "@kenstack/modules/siteSettings/queries";

import { Suspense } from "react";

export const generateMetadata = loadSiteSettingsMetadata;

export default async function SiteLayout({ children }) {
  return (
    <SiteShell>
      <Suspense fallback={null}>{children}</Suspense>
    </SiteShell>
  );
}

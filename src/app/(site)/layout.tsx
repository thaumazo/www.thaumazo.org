import SiteShell from "@/components/SiteShell";
import { loadSiteSettingsMetadata } from "@kenstack/modules/siteSettings/queries";
import Progress from "@kenstack/components/Progress";

import type { ReactNode } from "react";
import { Suspense } from "react";

export const generateMetadata = loadSiteSettingsMetadata;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <Suspense fallback={<Progress className="my-16" />}>{children}</Suspense>
    </SiteShell>
  );
}

import NotFound from "@/components/NotFound";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function SiteNotFound() {
  return <NotFound />;
}

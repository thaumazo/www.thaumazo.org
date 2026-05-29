import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageControls } from "@kenstack/admin/components/PageControls";
import RecaptchaProvider from "@kenstack/context/RecaptchaProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <RecaptchaProvider>
        <div className="flex min-h-[100dvh] flex-col">
          <Header />
          <PageControls />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
      </RecaptchaProvider>
      <GoogleAnalytics gaId="G-XV6M6H54V2" />
    </>
  );
}

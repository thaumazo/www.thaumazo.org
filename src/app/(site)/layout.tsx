import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecaptchaProvider from "@kenstack/context/RecaptchaProvider";
// import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { loadSiteSettingsMetadata } from "@kenstack/modules/siteSettings/queries";

import { Suspense } from "react";

export const generateMetadata = loadSiteSettingsMetadata;

export default async function SiteLayout({ children }) {
  return (
    <>
      <RecaptchaProvider>
        <Header />
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        {/* <GoogleAnalytics gaId="G-WC8VW2K63D" /> */}
      </RecaptchaProvider>
      <GoogleAnalytics gaId="G-XV6M6H54V2" />
    </>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecaptchaProvider from "@kenstack/context/RecaptchaProvider";
// import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Thaumazo",
    template: "%s — Thaumazo",
  },
};

export default async function SiteLayout({ children }) {
  return (
    <>
      <RecaptchaProvider>
        <Header />
        {children}
        <Footer />
        {/* <GoogleAnalytics gaId="G-WC8VW2K63D" /> */}
      </RecaptchaProvider>
      <GoogleAnalytics gaId="G-XV6M6H54V2" />
    </>
  );
}

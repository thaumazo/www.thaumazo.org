import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="text-foreground block text-8xl font-bold">404</span>
        <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
        <div className="text-muted-foreground mt-4 max-w-xl text-base leading-7">
          <p>
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}

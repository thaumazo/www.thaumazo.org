import { Suspense } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import SiteAccountMenu from "@/components/AccountMenu";
import Navigation from "./Navigation";
import MobileNavigation from "./Mobile";

const navigation = [
  ["Community", "/community"],
  ["Organizations", "/organizations"],
  ["Projects", "/projects"],
  ["Services", "/services"],
  ["Contact", "/contact"],
];

export default function Header() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 [mask-image:linear-gradient(to_bottom,black_0%,black_46%,transparent_100%)] bg-[length:560px_auto] bg-center opacity-45 md:h-40"
        style={{ backgroundImage: "url('/images/backgrounds/site-flare.png')" }}
        aria-hidden="true"
      />
      <header className="relative mx-auto grid max-w-6xl grid-cols-[48px_1fr_48px] items-center gap-4 px-4 py-1 md:flex md:justify-between md:py-3">
        <div className="justify-self-start md:hidden">
          <Suspense fallback={null}>
            <MobileNavigation navigation={navigation} />
          </Suspense>
        </div>
        <Link
          className="min-w-0 justify-self-center md:justify-self-start"
          href="/"
        >
          <Logo className="h-12 w-12 md:hidden" />
          <Image
            src="/images/logo/thaumazo-symbol-beside.svg"
            alt="Thaumazo"
            width={186}
            height={48}
            className="hidden h-12 w-auto md:block"
          />
        </Link>
        <div className="flex-none justify-self-end md:flex md:w-auto md:items-center md:gap-8">
          <Suspense fallback={null}>
            <Navigation links={navigation} className="md:mx-0" />
          </Suspense>
          <Suspense fallback={null}>
            <SiteAccountMenu
              fallback={
                <Button
                  asChild
                  className="h-8 px-2 text-xs md:h-10 md:px-4 md:text-base"
                >
                  <a
                    href="https://square.link/u/pTr9ZYIy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Donate
                  </a>
                </Button>
              }
            />
          </Suspense>
        </div>
      </header>
    </div>
  );
}

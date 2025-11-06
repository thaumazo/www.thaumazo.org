import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// import AccountMenu from "../AccountMenu";
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
    <header className="mx-auto max-w-6xl px-4 py-1 md:py-2 grid grid-cols-[48px_1fr_48px] items-center gap-4 md:flex">
      <div className="md:hidden justify-self-start">
        <MobileNavigation navigation={navigation} />
      </div>
      <Link
        className="justify-self-center min-w-0 md:shrink md:grow-0"
        href="/"
      >
        <Logo className="h-12 w-12 md:h-24 md:w-24" />
      </Link>
      <Navigation links={navigation} />
      <div className="justify-self-end md:w-24 flex-none">
        <Button
          asChild
          className="h-8 px-2 text-xs md:h-10 md:px-4 md:text-base"
          variant="outline"
        >
          <a
            href="https://square.link/u/pTr9ZYIy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donate
          </a>
        </Button>
      </div>
    </header>
  );
}

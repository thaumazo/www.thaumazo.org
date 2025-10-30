import Logo from "@/components/Logo";
import NextLink from "next/link";

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
    <header className="mx-auto flex max-w-6xl items-center px-4 py-1 md:py-2 gap-4">
      <MobileNavigation navigation={navigation} />
      <NextLink
        className="flex flex-grow justify-center md:flex-shrink md:flex-grow-0"
        href="/"
      >
        <Logo className="h-12 w-12 md:h-24 md:w-24" />
      </NextLink>
      <Navigation className="mx-auto" links={navigation} />
      <div className="w-12 md:w-24">{/* <AccountMenu /> */}</div>
    </header>
  );
}

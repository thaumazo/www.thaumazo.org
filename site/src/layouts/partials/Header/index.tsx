import Logo from "@/layouts/components/Logo";
import Link from "next/link";

import ThemeSwitcher from "@/layouts/components/ThemeSwitcher";
import AccountMenu from "@/components/AccountMenu";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className={`header z-30 sticky top-0`}>
      <nav className="navbar container">
        <div className="order-0 flex-shrink-0">
          <Logo />
        </div>
        {/* navbar toggler */}
        <input id="nav-toggle" type="checkbox" className="hidden" />
        <label
          htmlFor="nav-toggle"
          className="order-3 cursor-pointer flex items-center lg:hidden text-dark dark:text-white lg:order-1"
        >
          <svg
            id="show-button"
            className="h-6 fill-current block"
            viewBox="0 0 20 20"
          >
            <title>Menu Open</title>
            <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path>
          </svg>
          <svg
            id="hide-button"
            className="h-6 fill-current hidden"
            viewBox="0 0 20 20"
          >
            <title>Menu Close</title>
            <polygon
              points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
              transform="rotate(45 10 10)"
            ></polygon>
          </svg>
        </label>
        <Navigation />
        {/* /navbar toggler */}

        <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
          {/*
          {settings.search && (
            <button
              className="border-border text-dark hover:text-primary dark:border-darkmode-border mr-5 inline-block border-r pr-5 text-xl dark:text-white dark:hover:text-darkmode-primary"
              aria-label="search"
              data-search-trigger
            >
              <IoSearch />
            </button>
          )}
          */}
          {/* KS: Matching size with the logo to ensure nav is centered */}
          <ThemeSwitcher className="lg:ml-[90px] mr-5" />
          <AccountMenu />
          {/*}
            <Link
              className="btn btn-outline-primary btn-sm hidden lg:inline-block"
              href="/"
            >
             Call to Action
            </Link>
          */}
        </div>
      </nav>
    </header>
  );
};

export default Header;

import { Suspense } from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AccountMenu from '@kenstack/components/AccountMenu';

// import AccountMenu from "../AccountMenu";
import Navigation from './Navigation';
import MobileNavigation from './Mobile';

const navigation = [
  ['Community', '/community'],
  ['Organizations', '/organizations'],
  ['Projects', '/projects'],
  ['Services', '/services'],
  ['Contact', '/contact'],
];

export default function Header() {
  return (
    <header className="mx-auto grid max-w-6xl grid-cols-[48px_1fr_48px] items-center gap-4 px-4 py-1 md:flex md:py-2">
      <div className="justify-self-start md:hidden">
        <MobileNavigation navigation={navigation} />
      </div>
      <Link className="min-w-0 justify-self-center md:shrink md:grow-0" href="/">
        <Logo className="h-12 w-12 md:h-24 md:w-24" />
      </Link>
      <Navigation links={navigation} />
      <div className="flex-none justify-self-end md:w-24">
        <Suspense>
          <AccountMenu
            fallback={
              <Button
                asChild
                className="h-8 px-2 text-xs md:h-10 md:px-4 md:text-base"
                variant="outline"
              >
                <a href="https://square.link/u/pTr9ZYIy" target="_blank" rel="noopener noreferrer">
                  Donate
                </a>
              </Button>
            }
          />
        </Suspense>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

// import NextLink from "next/link";
import Link from "next/link";

import MenuIcon from "@kenstack/icons/Menu";
import CloseIcon from "@kenstack/icons/Close";
// import { useUserInfo } from "@/context/userInfo";
// import AccountItems from "@/components/AccountMenu/Items";
// import LogoutButton from "@/components/AccountMenu/LogoutButton";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MobileNavigation({ navigation }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="group cursor-pointer md:hidden">
        <MenuIcon className="inline size-10 group-data-[state=open]:hidden" />
        <CloseIcon className="inline size-10 group-data-[state=closed]:hidden" />
      </PopoverTrigger>
      <PopoverContent
        className="flex w-max flex-col px-8"
        onClick={(evt: React.MouseEvent<HTMLElement>) => {
          const name = (evt.target as HTMLElement).nodeName;
          if (name === "A" || name === "BUTTON") {
            setOpen(false);
          }
        }}
      >
        <nav className="flex flex-col gap-2">
          {navigation.map(([title, href], key) => {
            const active = pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                className={
                  "w-full justify-start border-b transition " +
                  (active
                    ? "border-gray-900 dark:border-gray-100"
                    : "border-transparent hover:border-gray-900 dark:hover:border-gray-100")
                }
                href={href}
                key={key}
              >
                {title}
              </Link>
            );
          })}
        </nav>
      </PopoverContent>
    </Popover>
  );
}

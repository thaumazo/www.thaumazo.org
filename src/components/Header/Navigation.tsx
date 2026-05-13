"use client";

import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

import Link from "next/link";

export default function Navigation({ links, className = "" }) {
  const pathname = usePathname();
  return (
    <nav className={twMerge("text-md mx-auto hidden gap-4 md:flex", className)}>
      {links.map(([title, href]) => {
        const active = pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={title}
            href={href}
            className={
              "border-b transition " +
              (active
                ? "border-gray-900 dark:border-gray-100"
                : "border-transparent hover:border-gray-900 dark:hover:border-gray-100")
            }
          >
            {title}
          </Link>
        );
      })}
    </nav>
  );
}

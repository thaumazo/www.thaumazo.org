"use client";

import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

import Link from "@/components/Link";

export default function Navigation({ links, className }) {
  const pathname = usePathname();
  return (
    <nav className={twMerge("hidden md:flex mx-4 gap-4", className)}>
      {links.map(([title, href]) => (
        <Link
          key={title}
          href={href}
          className={pathname.startsWith(href) && "underline"}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
}

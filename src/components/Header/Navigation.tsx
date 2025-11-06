"use client";

import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

import Link from "next/link";

export default function Navigation({ links, className = "" }) {
  const pathname = usePathname();
  return (
    <nav className={twMerge("hidden md:flex mx-auto gap-4 text-md", className)}>
      {links.map(([title, href]) => (
        <Link
          key={title}
          href={href}
          className={
            "hover:underline" + (pathname.startsWith(href) ? " underline" : "")
          }
        >
          {title}
        </Link>
      ))}
    </nav>
  );
}

"use client";

// import { Suspense } from "react";

import "./sidebar.scss";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar({ links }) {
  const pathname = usePathname();
  let hasActive = false;
  return (
    <nav className="sidebar flex flex-col space-y-2">
      {links.map(([href, text, Icon], key) => {
        let active = false;
        if (hasActive === false && href.startsWith(pathname)) {
          active = hasActive = true;
        }

        return (
          <Link
            href={href}
            className={`
                flex
                items-center
                px-2
                text-gray-700
                border-t border-b border-gray-300 
                rounded-sm
                transition
                duration-300
                ${active && "active"}
              `}
            key={key}
          >
            <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="flex-grow">{text}</span>
          </Link>
        );
      })}
    </nav>
  );
}

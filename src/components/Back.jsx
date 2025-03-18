"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";

export default function Back() {
  const pathname = usePathname();
  return (
    <Link
      href={pathname.replace(/\/[^/]+$/, "")}
      className="flex items-center gap-1 my-2"
    >
      <ChevronLeftIcon className="w-4 h-4" />
      Back
    </Link>
  );
}

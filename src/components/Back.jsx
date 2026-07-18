"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";

export default function Back() {
  const pathname = usePathname();
  return (
    <Link
      href={pathname.replace(/\/[^/]+$/, "")}
      className="my-2 flex items-center gap-1"
    >
      <ChevronLeftIcon className="h-4 w-4" />
      Back
    </Link>
  );
}

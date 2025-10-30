import { loadMD, loadMetadata } from "@/utils/loadMD";
import { notFound } from "next/navigation";
import Main from "@//components/Main";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Sprout, BookOpen, Egg, ArrowRight } from "lucide-react";

type Item = {
  // href: `/${string}`;
  slug: string;
  title: string;
  Icon: LucideIcon;
  bg: string;
  description: string;
};

const items = [
  {
    slug: "red-alder-work",
    title: "Red Alder Work",
    Icon: Sprout,
    bg: "bg-gradient-to-br from-rose-700 to-amber-600", // alder-inspired
    description: "Restorative, groundwork projects.",
  },
  {
    slug: "story-time",
    title: "Storytime",
    Icon: BookOpen,
    bg: "bg-gradient-to-br from-sky-600 to-indigo-500",
    description: "Narratives, notes, and field journals.",
  },
  {
    slug: "metachrysalis",
    title: "Metachrysalis",
    Icon: Egg,
    bg: "bg-gradient-to-br from-amber-500 to-lime-600",
    description: "Transformation, prototypes, and launches.",
  },
] as const satisfies readonly Item[];

export const metadata = loadMetadata("services/page.md");

export default async function Page() {
  const data = await loadMD("services/page.md");
  if (data === false) {
    notFound();
  }

  return (
    <div className="container flex flex-col gap-6">
      <Main title={data.title} content={data.content} image={data.image} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
        {items.map(({ slug, title, Icon, bg, description }) => {
          const href = "/services/" + slug;
          return (
            <li key={href}>
              <Link
                href={href}
                className="group flex flex-col items-center text-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700/50 dark:border-stone-800 dark:bg-stone-900"
              >
                <div
                  className={`relative size-16 shrink-0 overflow-hidden rounded-xl ${bg} mb-4`}
                  aria-hidden="true"
                >
                  <Icon className="absolute inset-0 m-auto size-10 text-white drop-shadow" />
                </div>

                <div className="min-w-0">
                  <h2 className="flex items-center justify-center gap-2 text-lg font-medium">
                    <span className="truncate">{title}</span>
                    <ArrowRight className="size-4 translate-x-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600 dark:text-stone-400">
                    {description}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

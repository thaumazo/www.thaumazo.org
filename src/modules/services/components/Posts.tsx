import { ArrowRight } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { listServices } from "@/modules/services/queries";

export default async function Posts() {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  const posts = await listServices();

  return (
    <ul className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(({ slug, title, image, description }) => {
        const href = "/services/" + slug;
        return (
          <li key={href}>
            <Link
              href={href}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition hover:bg-gray-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700/50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
            >
              <div
                className="relative mb-4 size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800"
                aria-hidden="true"
              >
                {image ? (
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={image.kind === "svg"}
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <h2 className="flex items-center justify-center gap-2 text-lg leading-tight font-medium">
                  <span className="min-w-0 text-wrap">{title}</span>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 translate-x-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
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
  );
}

import Image from "next/image";
import Link from "next/link";

import { AdminShortcutLink } from "@kenstack/admin/components/PageControls";
import { listServices } from "@/modules/services/queries";

export default async function Posts() {
  const posts = await listServices();

  return (
    <div className="relative mx-auto max-w-3xl">
      <AdminShortcutLink href="/admin/services" label="Edit Services" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(({ slug, title, image, description }) => {
          const href = "/services/" + slug;
          return (
            <li key={href}>
              <Link
                href={href}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm transition hover:border-stone-300 hover:bg-stone-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700/50 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 dark:hover:bg-stone-800"
              >
                <div
                  className="relative mb-4 size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800"
                  aria-hidden="true"
                >
                  {image ? (
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={image.kind === "svg"}
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg leading-tight font-medium text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-100">
                    <span className="text-wrap">{title}</span>
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

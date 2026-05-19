import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Image from "next/image";
import Link from "next/link";

import { listCommunityUsers } from "@/modules/users/queries";

function getExcerpt(content: string | undefined) {
  if (!content) {
    return null;
  }

  const excerpt = content
    .replace(/\/\/|[#*_`>-]/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  return excerpt ?? null;
}

export default async function Posts() {
  const posts = await listCommunityUsers();

  return (
    <div className="mx-auto my-8 grid max-w-3xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(({ title, image, slug, roles, description, content }) => {
        const link = "/community/" + slug;
        const visibleRoles = roles.filter(Boolean).slice(0, 2);
        const excerpt = description || getExcerpt(content);

        return (
          <div key={slug} className="flex">
            <Link
              className="group flex w-full flex-col overflow-hidden rounded border border-stone-200 bg-white transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-700 dark:hover:bg-stone-900"
              href={link}
            >
              <span className="relative block aspect-[3/2] bg-gray-100 dark:bg-gray-800">
                {image ? (
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 224px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center p-3">
                    <UserIcon className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                  </span>
                )}
              </span>

              <span className="flex flex-1 flex-col gap-2 p-3.5 text-center">
                <span className="text-lg leading-tight text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-100">
                  <span className="text-wrap">{title}</span>
                </span>

                {excerpt && (
                  <span className="line-clamp-2 text-sm leading-5 text-gray-700 dark:text-gray-300">
                    {excerpt}
                  </span>
                )}

                {visibleRoles.length > 0 && (
                  <span className="mt-auto hidden flex-wrap justify-center gap-1 pt-1 sm:flex">
                    {visibleRoles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-gray-50 px-2 py-0.5 text-[11px] leading-5 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-800"
                      >
                        {role}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

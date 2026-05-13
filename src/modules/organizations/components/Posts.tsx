import Image from "next/image";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import React from "react";

import { listOrganizations } from "@/modules/organizations/queries";

function OrgMeta({
  children,
  label,
  tone = "neutral",
}: {
  children: React.ReactNode;
  label?: string;
  tone?: "green" | "neutral";
}) {
  const classes =
    tone === "green"
      ? "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-800"
      : "bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-800";

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] leading-5 ring-1 " +
        classes
      }
    >
      {label && (
        <span className="font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}

export default async function Posts() {
  "use cache";
  cacheLife("hours");
  cacheTag("organizations");

  const posts = await listOrganizations();

  return (
    <div className="mx-auto my-8 grid max-w-3xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(({ title, slug, image, description, sdgs, kind }) => {
        const link = "/organizations/" + slug;
        const organizationKinds = kind.filter(Boolean).slice(0, 1);
        const organizationSdgs = sdgs.filter(Boolean).slice(0, 4);
        const organizationSdgsLabel = organizationSdgs.join(", ");

        return (
          <Link
            key={slug}
            className="group flex w-full flex-col overflow-hidden rounded border border-stone-200 bg-white transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-700 dark:hover:bg-stone-900"
            href={link}
          >
            <span className="relative block aspect-[3/2] bg-gray-100 dark:bg-gray-800">
              {image ? (
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 224px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                />
              ) : null}
            </span>

            <span className="flex flex-1 flex-col gap-2 p-3.5 text-center">
              <span className="text-lg leading-tight text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-100">
                <span className="text-wrap">{title}</span>
              </span>

              {description && (
                <span className="line-clamp-2 text-sm leading-5 text-gray-700 dark:text-gray-300">
                  {description}
                </span>
              )}

              <span className="mt-auto hidden flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 sm:flex">
                {organizationKinds.length > 0 && (
                  <span className="flex flex-wrap items-center gap-1">
                    {organizationKinds.map((value) => (
                      <OrgMeta key={value}>{value}</OrgMeta>
                    ))}
                  </span>
                )}
                {organizationSdgsLabel && (
                  <span className="flex flex-wrap items-center gap-1">
                    <OrgMeta label="SDGs" tone="green">
                      {organizationSdgsLabel}
                    </OrgMeta>
                  </span>
                )}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

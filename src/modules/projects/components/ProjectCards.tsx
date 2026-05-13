import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { SiteImage } from "@/modules/siteContent";

export type ProjectCardData = {
  title: string;
  slug: string;
  image: SiteImage | null;
  description: string;
  location: string;
  sdgs: string[];
  status: string;
  kind: string[];
};

function ProjectMeta({
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ring-1 " +
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

export function ProjectCard({
  project: { title, slug, image, description, location, sdgs, status, kind },
}: {
  project: ProjectCardData;
}) {
  const link = "/projects/" + slug;
  const projectKinds = kind.filter(Boolean).slice(0, 2);
  const projectSdgs = sdgs.filter(Boolean).slice(0, 4);
  const projectKindLabel = projectKinds.join(", ");
  const projectSdgsLabel = projectSdgs.join(", ");

  return (
    <Link
      className="group grid gap-4 rounded border border-stone-200 bg-white p-3 text-center transition hover:border-stone-300 hover:bg-stone-50 sm:grid-cols-[11rem_1fr] sm:border-gray-200 sm:p-4 sm:text-left sm:hover:border-gray-300 sm:hover:bg-gray-50 dark:border-stone-800 dark:bg-gray-950 dark:hover:border-stone-700 dark:hover:bg-stone-900 sm:dark:border-gray-800 sm:dark:hover:border-gray-700 sm:dark:hover:bg-gray-900"
      href={link}
    >
      <span className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gray-100 sm:w-44 dark:bg-gray-800">
        <span className="flex h-full w-full items-center justify-center p-3">
          {image ? (
            <Image
              {...image}
              alt=""
              className="h-auto max-h-full w-auto max-w-full transition duration-300 group-hover:scale-[1.03]"
              sizes="(min-width: 640px) 160px, calc(100vw - 56px)"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 text-xl font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {title.charAt(0)}
            </span>
          )}
        </span>
      </span>

      <span className="flex min-w-0 flex-col justify-center gap-2.5 text-center sm:text-left">
        <span className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="text-lg leading-tight text-stone-950 transition group-hover:text-stone-700 sm:text-gray-950 sm:group-hover:text-gray-700 dark:text-stone-50 dark:group-hover:text-stone-100 sm:dark:text-gray-50 sm:dark:group-hover:text-gray-200">
              {title}
            </span>
            {location && (
              <span className="hidden shrink-0 text-sm whitespace-nowrap text-gray-500 sm:inline dark:text-gray-400">
                {location}
              </span>
            )}
          </span>

          {status && (
            <span className="hidden w-fit shrink-0 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-medium text-white sm:inline-flex dark:bg-gray-100 dark:text-gray-950">
              {status}
            </span>
          )}
        </span>

        {description && (
          <span className="text-sm leading-5 text-gray-700 dark:text-gray-300">
            {description}
          </span>
        )}

        <span className="hidden flex-wrap items-center gap-x-4 gap-y-1.5 sm:flex">
          <span className="flex flex-wrap items-center gap-1.5">
            {projectKindLabel && <ProjectMeta>{projectKindLabel}</ProjectMeta>}
          </span>
          <span className="flex flex-wrap items-center gap-1.5">
            {projectSdgsLabel && (
              <ProjectMeta label="SDGs" tone="green">
                {projectSdgsLabel}
              </ProjectMeta>
            )}
          </span>
        </span>
      </span>
    </Link>
  );
}

export function ProjectCardList({
  projects,
  className = "",
}: {
  projects: ProjectCardData[];
  className?: string;
}) {
  return (
    <div className={"grid grid-cols-1 gap-4 " + className}>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

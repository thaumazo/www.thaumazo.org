"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { ProjectCardData } from "@/modules/projects/components/ProjectCards";

function CompactProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      className="group grid grid-cols-[5.5rem_1fr] overflow-hidden rounded border border-gray-200 bg-white transition hover:border-gray-300 hover:bg-gray-50 sm:block dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 dark:hover:bg-gray-900"
      href={"/projects/" + project.slug}
    >
      <span className="flex aspect-square h-full min-h-24 items-center justify-center bg-gray-100 sm:aspect-[4/3] sm:h-auto dark:bg-gray-800">
        <span className="flex h-full w-full items-center justify-center p-2.5">
          {project.image ? (
            <Image
              {...project.image}
              alt=""
              className="h-auto max-h-full w-auto max-w-full transition duration-300 group-hover:scale-[1.03]"
              sizes="(min-width: 768px) 180px, (min-width: 640px) 50vw, 88px"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-base font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {project.title.charAt(0)}
            </span>
          )}
        </span>
      </span>

      <span className="flex min-w-0 items-center p-3 sm:min-h-20 sm:items-start">
        <span className="text-sm leading-snug text-gray-950 transition group-hover:text-gray-700 dark:text-gray-50 dark:group-hover:text-gray-200">
          {project.title}
        </span>
      </span>
    </Link>
  );
}

function CompactProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {projects.map((project) => (
        <CompactProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

export default function ExpandableProjectCards({
  projects,
  initialCount = 3,
}: {
  projects: ProjectCardData[];
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const remaining = Math.max(0, projects.length - initialCount);
  const visibleProjects = expanded ? projects : projects.slice(0, initialCount);

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <CompactProjectGrid projects={visibleProjects} />
      {!expanded && remaining > 0 ? (
        <button
          type="button"
          className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-900"
          onClick={() => {
            setExpanded(true);
          }}
        >
          Show {remaining} more {remaining === 1 ? "project" : "projects"}
        </button>
      ) : null}
    </div>
  );
}

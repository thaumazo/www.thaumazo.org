import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Back from "@/components/Back";
import Social from "@/components/Social";
import ExpandableProjectCards from "@/modules/projects/components/ExpandableProjectCards";
import { listProjects } from "@/modules/projects/queries";
import { getCommunityUser } from "@/modules/users/queries";
import { createMetadataLoader } from "@kenstack/admin/queries";
import Markdown from "@kenstack/components/Markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function Tags({ title, values }: { title: string; values: string[] }) {
  const tags = values.filter(Boolean);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="text-left">
      <h6 className="mb-1 font-bold">{title}</h6>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="rounded-full bg-gray-700 px-3 py-1 text-white"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileImage({
  image,
  title,
}: {
  image: NonNullable<Awaited<ReturnType<typeof getCommunityUser>>>["image"];
  title: string;
}) {
  const frameClass =
    "mb-4 flex aspect-square w-44 items-center justify-center overflow-hidden bg-gray-100 sm:float-right sm:mb-3 sm:ml-6 sm:w-56 dark:bg-gray-800";

  if (!image) {
    return (
      <div className={frameClass}>
        <UserIcon className="h-24 w-24" />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <Image
        src={image.url}
        width={image.width ?? 800}
        height={image.height ?? 800}
        alt={image.alt || title}
        className="h-full w-full object-cover"
        priority
        sizes="(min-width: 640px) 224px, 176px"
      />
    </div>
  );
}

export const generateMetadata = createMetadataLoader(getCommunityUser);

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={null}>
      <CommunityUserPage slug={slug} />
    </Suspense>
  );
}

async function CommunityUserPage({ slug }: { slug: string }) {
  const draft = (await draftMode()).isEnabled;
  const user = await getCommunityUser(slug, { draft });

  if (!user) {
    notFound();
  }

  const projects = await listProjects({
    userId: user.id,
    order: "recent",
    draft,
  });

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Back />
      </div>
      <main className="mx-auto my-8 flex max-w-3xl flex-col gap-4 px-4">
        <h1 className="text-left text-2xl">{user.title}</h1>

        <div className="flow-root">
          <ProfileImage image={user.image} title={user.title} />
          <Markdown className="markdown text-justify" content={user.content} />
        </div>

        {user.linkedin && (
          <div className="flex justify-end">
            <Social linkedin={user.linkedin} />
          </div>
        )}

        <Tags title="Roles" values={user.roles} />
        {projects.length > 0 ? (
          <div className="space-y-2 text-left">
            <h6 className="font-bold">Projects</h6>
            <ExpandableProjectCards projects={projects} />
          </div>
        ) : null}
      </main>
    </>
  );
}

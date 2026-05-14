import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Back from "@/components/Back";
import RelatedLinks from "@/components/RelatedLinks";
import Sdgs from "@/components/Sdgs";
import {
  getOrganization,
  listOrganizationUsers,
} from "@/modules/organizations/queries";
import ExpandableProjectCards from "@/modules/projects/components/ExpandableProjectCards";
import { listProjects } from "@/modules/projects/queries";
import Markdown from "@kenstack/components/Markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const organization = await getOrganization(slug);

  if (!organization) {
    return {};
  }

  return {
    title: organization.seoTitle || organization.title,
    description: organization.seoDescription || organization.description,
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      {params.then(({ slug }) => (
        <OrganizationPage slug={slug} />
      ))}
    </Suspense>
  );
}

async function OrganizationPage({ slug }: { slug: string }) {
  "use cache";
  cacheLife("hours");
  cacheTag(`organizations:${slug}`);

  const organization = await getOrganization(slug);

  if (!organization) {
    notFound();
  }

  const [liaisons, projects] = await Promise.all([
    listOrganizationUsers(organization.id, "liaison"),
    listProjects({ organizationId: organization.id, order: "recent" }),
  ]);

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Back />
      </div>
      <main className="mx-auto my-8 flex max-w-3xl flex-col gap-4 px-4">
        <div className="flex items-center gap-4">
          {organization.image && (
            <Image
              {...organization.image}
              alt={organization.image.alt}
              className="h-auto max-h-24 max-w-24"
              priority
            />
          )}

          <h1 className="text-left text-2xl">{organization.title}</h1>
        </div>

        <Markdown
          className="markdown text-justify"
          content={organization.content}
        />

        <Sdgs sdgs={organization.sdgs} />

        {organization.url && (
          <div className="text-left">
            <h6 className="font-bold">Url</h6>
            <a href={organization.url}>{organization.url}</a>
          </div>
        )}

        <RelatedLinks
          title="Liaisons"
          links={liaisons}
          hrefPrefix="/community"
        />
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

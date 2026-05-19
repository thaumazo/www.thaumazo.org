import type { Metadata } from "next";
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
import { isPreviewRequest, type SiteSearchParams } from "@/modules/siteContent";
import { buildMetadata } from "@kenstack/admin";
import Markdown from "@kenstack/components/Markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SiteSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const organization = await getOrganization(slug, {
    preview: isPreviewRequest(query),
  });

  return buildMetadata(organization);
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  return (
    <Suspense fallback={null}>
      <OrganizationPage slug={slug} preview={isPreviewRequest(query)} />
    </Suspense>
  );
}

async function OrganizationPage({
  slug,
  preview = false,
}: {
  slug: string;
  preview?: boolean;
}) {
  const organization = await getOrganization(slug, { preview });

  if (!organization) {
    notFound();
  }

  const [liaisons, projects] = await Promise.all([
    listOrganizationUsers(organization.id, "liaison", { preview }),
    listProjects({ organizationId: organization.id, order: "recent", preview }),
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
              src={organization.image.url}
              width={organization.image.width ?? 800}
              height={organization.image.height ?? 800}
              alt={organization.image.alt ?? organization.title}
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

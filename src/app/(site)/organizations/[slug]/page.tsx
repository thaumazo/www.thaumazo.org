import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import * as z from "zod";

import Back from "@/components/Back";
import RelatedLinks from "@/components/RelatedLinks";
import Sdgs from "@/components/Sdgs";
import {
  getOrganization,
  listOrganizationUsers,
} from "@/modules/organizations/queries";
import ExpandableProjectCards from "@/modules/projects/components/ExpandableProjectCards";
import { listProjects } from "@/modules/projects/queries";
import { AdminRecordShortcutLink } from "@kenstack/admin/components/PageControls";
import { createMetadataLoader } from "@kenstack/admin/queries";
import Markdown from "@kenstack/components/Markdown";
import { pageRoute } from "@kenstack/pageRoute";

export const generateMetadata = createMetadataLoader(getOrganization);

export default pageRoute(
  {
    params: z.object({
      slug: z.string(),
    }),
  },
  ({ params }) => <OrganizationPage slug={params.slug} />,
);

async function OrganizationPage({ slug }: { slug: string }) {
  const draft = (await draftMode()).isEnabled;
  const organization = await getOrganization(slug, { draft });

  if (!organization) {
    notFound();
  }

  const [liaisons, projects] = await Promise.all([
    listOrganizationUsers(organization.id, "liaison", { draft }),
    listProjects({ organizationId: organization.id, order: "recent", draft }),
  ]);

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Back />
      </div>
      <main className="relative mx-auto my-8 flex max-w-3xl flex-col gap-4 px-4">
        <AdminRecordShortcutLink
          moduleName="organizations"
          id={organization.id}
          title={organization.title}
        />
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

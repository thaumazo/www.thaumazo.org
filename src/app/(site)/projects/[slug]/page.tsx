import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import * as z from "zod";

import Back from "@/components/Back";
import DateRange from "@/components/DateRange";
import RelatedLinks from "@/components/RelatedLinks";
import Sdgs from "@/components/Sdgs";
import {
  getProject,
  listProjectOrganizations,
  listProjectUsers,
} from "@/modules/projects/queries";
import { AdminRecordShortcutLink } from "@kenstack/admin/components/PageControls";
import { createMetadataLoader } from "@kenstack/admin/queries";
import Markdown from "@kenstack/components/Markdown";
import { pageRoute } from "@kenstack/pageRoute";

function dateValue(date: Date | null) {
  return date ? date.toISOString() : null;
}

function ProjectImage({
  image,
  title,
}: {
  image: NonNullable<Awaited<ReturnType<typeof getProject>>>["image"];
  title: string;
}) {
  if (!image) {
    return null;
  }

  return (
    <div className="mb-4 flex w-full items-center justify-center overflow-hidden bg-gray-100 sm:float-right sm:mb-3 sm:ml-6 sm:w-72 lg:w-80 dark:bg-gray-800">
      <Image
        src={image.url}
        width={image.width ?? 800}
        height={image.height ?? 800}
        alt={image.alt || title}
        className="h-auto max-h-72 w-auto max-w-full sm:max-h-80"
        priority
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, calc(100vw - 32px)"
      />
    </div>
  );
}

export const generateMetadata = createMetadataLoader(getProject);

export default pageRoute(
  {
    params: z.object({
      slug: z.string(),
    }),
  },
  ({ params }) => <ProjectPage slug={params.slug} />,
);

async function ProjectPage({ slug }: { slug: string }) {
  const draft = (await draftMode()).isEnabled;
  const project = await getProject(slug, { draft });

  if (!project) {
    notFound();
  }

  const [liaisons, organizations] = await Promise.all([
    listProjectUsers(project.id, "liaison", { draft }),
    listProjectOrganizations(project.id, { draft }),
  ]);

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Back />
      </div>
      <main className="relative mx-auto my-8 flex max-w-3xl flex-col gap-4 px-4">
        <AdminRecordShortcutLink
          moduleName="projects"
          id={project.id}
          title={project.title}
        />
        <h1 className="text-left text-2xl">{project.title}</h1>

        {(project.location || project.startDate) && (
          <div className="flex flex-wrap gap-4">
            {project.location && (
              <div className="rounded-full border-2 border-gray-800 px-3">
                {project.location}
              </div>
            )}
            {project.startDate && (
              <div className="rounded-full border-2 border-gray-800 px-3">
                <DateRange
                  start_date={dateValue(project.startDate)}
                  end_date={dateValue(project.endDate)}
                />
              </div>
            )}
          </div>
        )}

        <div className="flow-root">
          <ProjectImage image={project.image} title={project.title} />
          <Markdown
            className="markdown text-justify"
            content={project.content}
          />
        </div>

        <Sdgs sdgs={project.sdgs} />

        {project.url && (
          <div className="text-left">
            <h6>Url</h6>
            <a href={project.url}>{project.url}</a>
          </div>
        )}

        <RelatedLinks
          title="Liaisons"
          links={liaisons}
          hrefPrefix="/community"
        />
        <RelatedLinks
          title="Organizations"
          links={organizations}
          hrefPrefix="/organizations"
        />
      </main>
    </>
  );
}

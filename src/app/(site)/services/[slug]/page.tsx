import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Back from "@/components/Back";
import RelatedLinks from "@/components/RelatedLinks";
import { getService, listServiceUsers } from "@/modules/services/queries";
import { createMetadataLoader } from "@kenstack/admin/queries";
import Markdown from "@kenstack/components/Markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function ServiceImage({
  image,
  title,
}: {
  image: NonNullable<Awaited<ReturnType<typeof getService>>>["image"];
  title: string;
}) {
  if (!image) {
    return null;
  }

  return (
    <div className="mb-4 flex w-full items-center justify-center overflow-hidden bg-gray-100 sm:float-right sm:mb-3 sm:ml-6 sm:w-56 dark:bg-gray-800">
      <Image
        src={image.url}
        width={image.width ?? 800}
        height={image.height ?? 800}
        alt={image.alt || title}
        className="h-auto max-h-56 w-auto max-w-full"
        priority
        sizes="(min-width: 640px) 224px, calc(100vw - 32px)"
        unoptimized={image.kind === "svg"}
      />
    </div>
  );
}

export const generateMetadata = createMetadataLoader(getService);

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={null}>
      <ServicePage slug={slug} />
    </Suspense>
  );
}

async function ServicePage({ slug }: { slug: string }) {
  const draft = (await draftMode()).isEnabled;
  const service = await getService(slug, { draft });

  if (!service) {
    notFound();
  }

  const liaisons = await listServiceUsers(service.id, "liaison", { draft });

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Back />
      </div>
      <main className="mx-auto my-8 flex max-w-3xl flex-col gap-4 px-4">
        <h1 className="text-left text-2xl">{service.title}</h1>

        <div className="flow-root">
          <ServiceImage image={service.image} title={service.title} />
          <Markdown
            className="markdown text-justify"
            content={service.content}
          />
        </div>

        <RelatedLinks
          title="Liaisons"
          links={liaisons}
          hrefPrefix="/community"
        />
      </main>
    </>
  );
}

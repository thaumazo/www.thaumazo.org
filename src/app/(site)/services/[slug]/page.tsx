import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Back from "@/components/Back";
import RelatedLinks from "@/components/RelatedLinks";
import { getService, listServiceUsers } from "@/modules/services/queries";
import { isPreviewRequest, type SiteSearchParams } from "@/modules/siteContent";
import { buildMetadata } from "@kenstack/admin";
import Markdown from "@kenstack/components/Markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SiteSearchParams>;
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

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const service = await getService(slug, { preview: isPreviewRequest(query) });

  return buildMetadata(service);
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  return (
    <Suspense fallback={null}>
      <ServicePage slug={slug} preview={isPreviewRequest(query)} />
    </Suspense>
  );
}

async function ServicePage({
  slug,
  preview = false,
}: {
  slug: string;
  preview?: boolean;
}) {
  const service = await getService(slug, { preview });

  if (!service) {
    notFound();
  }

  const liaisons = await listServiceUsers(service.id, "liaison", { preview });

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

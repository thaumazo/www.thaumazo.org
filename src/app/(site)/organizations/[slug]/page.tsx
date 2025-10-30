import { loadMD, loadMetadata } from "@/utils/loadMD";
import listMD from "@/utils/listMD";

import Back from "@/components/Back";
import Image from "next/image";
import Markdown from "@kenstack/components/Markdown";
import Sdgs from "@/components/Sdgs";
import InfoTags from "@/components/InfoTags";

import RelatedProjects from "@/components/projects/RelatedProjects";

import { notFound } from "next/navigation";
import { postSchema } from "@/schemas/post";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return await loadMetadata("organizations/posts/" + slug);
}

export async function generateStaticParams() {
  const list = await listMD("organizations/posts");
  return list.map((v) => ({ slug: v.slug }));
}
// export const dynamicParams = false;

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await loadMD<typeof postSchema>(
    "organizations/posts/" + slug,
    postSchema
  );
  if (data === false) {
    notFound();
  }

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <Back />
      </div>
      <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto my-8">
        <div className="flex gap-4 items-center">
          {data.image && (
            <Image
              {...data.image}
              alt={data.image.alt || ""}
              className="max-w-24 max-h-auto"
              priority
            />
          )}

          <h1 className="text-left text-2xl">{data.title}</h1>
        </div>
        <Markdown className="markdown text-justify" content={data.content} />
        <Sdgs sdgs={data.sdgs} />
        {data.url && (
          <div className="text-left">
            <h6 className="font-bold">Url</h6>
            <a href={data.url}>{data.url}</a>
          </div>
        )}
        <InfoTags
          title="Liaisons"
          path="/community"
          references="community/people"
          field={data.liaison}
        />

        <RelatedProjects field="partners" slug={slug} />
      </main>
    </>
  );
}

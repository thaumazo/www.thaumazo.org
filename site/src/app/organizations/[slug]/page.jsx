import Post from "@/components/Post";
import RelatedProjects from "@/components/projects/RelatedProjects";

import loadMD from "@/utils/loadMD";
import { notFound } from "next/navigation";

import listMD from "@/utils/listMD";
export async function generateStaticParams() {
  let list = await listMD("organizations/posts");
  return list.map((v) => ({ slug: v.slug }));
}
export const dynamicParams = false;

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await loadMD("organizations/posts/" + slug);
  if (data === false) {
    notFound();
  }

  return (
    <Post data={data}>
      <RelatedProjects field="partners" slug={slug} />
    </Post>
  );
}

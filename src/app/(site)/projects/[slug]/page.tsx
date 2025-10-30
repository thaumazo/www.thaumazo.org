import { loadMD, loadMetadata } from "@/utils/loadMD";
import listMD from "@/utils/listMD";
import { postSchema } from "@/schemas/post";

import Post from "@/components/Post";

import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return await loadMetadata("projects/posts/" + slug);
}

export async function generateStaticParams() {
  const list = await listMD("projects/posts");
  return list.map((v) => ({ slug: v.slug }));
}
// export const dynamicParams = false;

export default async function Page({ params }) {
  const { slug } = await params;

  const data = await loadMD("projects/posts/" + slug, postSchema);

  if (data === false) {
    notFound();
  }

  return <Post data={data} />;
}

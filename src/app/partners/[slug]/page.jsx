import Post from "@/components/Post";

import loadMD from "@/utils/loadMD";
import { notFound } from "next/navigation";

import listMD from "@/utils/listMD";
export async function generateStaticParams() {
  let list = await listMD("partners/posts");
  return list.map((v) => ({ slug: v.slug }));
}
export const dynamicParams = false;

export default async function Page({ params: { slug } }) {
  const data = await loadMD("partners/posts/" + slug);
  if (data === false) {
    notFound();
  }

  return <Post data={data} />;
}

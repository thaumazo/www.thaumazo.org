import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Post from "@/components/Post";
import RelatedProjects from "@/components/projects/RelatedProjects";

import loadMD from "@/utils/loadMD";
import { notFound } from "next/navigation";

import listMD from "@/utils/listMD";
export async function generateStaticParams() {
  let list = await listMD("community/people");
  return list.map((v) => ({ slug: v.slug }));
}
export const dynamicParams = false;

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await loadMD("community/people/" + slug);
  if (data === false) {
    notFound();
  }

  const defaultImage = (
    <div className="inline-flex items-center justify-center w-48 h-48 mb-4 bg-gray-200 dark:bg-gray-800">
      <UserIcon className="w-24 h-24" />
    </div>
  );

  return (
    <Post data={data} defaultImage={defaultImage}>
      <RelatedProjects field="liaison" slug={slug} />
    </Post>
  );
}

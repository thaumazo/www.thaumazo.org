import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Post from "@/components/Post";

import loadMD from "@/utils/loadMD";
import { notFound } from "next/navigation";

export default async function Page({ params: { slug } }) {
  const data = await loadMD("community/people/" + slug);
  console.log('page is loading', typeof(data), "community/people/" + slug);
  if (data === false) {
    notFound();
  }

  const defaultImage = (
    <div className="inline-flex items-center justify-center w-48 h-48 mb-4 bg-gray-200 dark:bg-gray-800">
      <UserIcon className="w-24 h-24" />
    </div>
  );

  return <Post data={data} defaultImage={defaultImage} />;
}

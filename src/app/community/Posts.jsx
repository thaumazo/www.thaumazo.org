import listMD from "@/utils/listMD";
import Link from "next/link";
import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";

import Image from "next/image";

export default async function Posts() {
  let postData = await listMD("community/people");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto my-8">
      {posts.map(({ title, image, slug }) => {
        const link = "/community/" + slug;
        return (
          <div key={slug} className="flex justify-center row">
            <Link
              className="flex items-center justify-center w-32 h-32 rounded overflow-hidden bg-gray-200 dark:bg-gray-800"
              href={link}
            >
              {image ? (
                <Image {...image} alt="" className="max-w-32 max-h-32" />
              ) : (
                <UserIcon className="w-16 h-16" />
              )}
            </Link>
            <Link className="flex justify-center" href={link}>
              {title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

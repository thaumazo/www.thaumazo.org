import listMD from "@/utils/listMD";
import Link from "next/link";

import Image from "next/image";

export default async function Posts() {
  let postData = await listMD("organizations/posts");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[1fr] max-w-3xl mx-auto my-8">
      {posts.map(({ title, slug, image }) => {
        const link = "/organizations/" + slug;
        return (
          <Link
            key={slug}
            className="flex flex-col items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 hover:dark:bg-gray-700  transition"
            href={link}
          >
            <div className="flex h-32 items-center justify-center">
              {image ? (
                <Image
                  {...image}
                  alt=""
                  className="w-auto h-auto max-h-32"
                  sizes="128px"
                  priority
                />
              ) : null}
            </div>
            <div>{title}</div>
          </Link>
        );
      })}
    </div>
  );
}

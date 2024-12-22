import listMD from "@/utils/listMD";
import Link from "next/link";

import Image from "next/image";

export default async function Posts() {
  let postData = await listMD("organizations/posts");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto my-8">
      {posts.map(({ title, slug, image }) => {
        const link = "/organizations/" + slug;
        return (
          <div key={slug} className="flex justify-center">
            <Link
              className="flex flex-col items-center justify-center"
              href={link}
            >
              {image ? (
                <Image
                  {...image}
                  alt=""
                  className="w-auto h-auto w-full"
                  sizes="128px"
                  priority
                />
              ) : null}
              <span>{title}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

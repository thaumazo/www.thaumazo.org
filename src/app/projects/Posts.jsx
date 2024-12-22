import React from "react";
import listMD from "@/utils/listMD";
import Link from "next/link";

import Image from "next/image";

export default async function Posts() {
  let postData = await listMD("projects/posts");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 max-w-3xl mx-auto my-8">
      {posts.map(({ title, slug, image }) => {
        const link = "/projects/" + slug;
        return (
          <div key={slug}>
            <Link className="flex gap-4 justify-left items-center" href={link}>
              <span className="block w-32">
                {image ? (
                  <Image
                    {...image}
                    alt=""
                    className="w-auto h-auto max-h-32"
                    sizes="128px"
                    priority
                  />
                ) : null}
              </span>

              {title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

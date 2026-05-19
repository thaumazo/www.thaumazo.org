"use client";

import Link from "next/link";
import Image from "next/image";
import MetaDates from "@kenstack/admin/components/MetaDates";
import { type ListItemComponent } from "@kenstack/admin/client";
import { type SelectedImage } from "@kenstack/db/tables";

const ListItem: ListItemComponent<{
  image: SelectedImage | null;
  title: string;
  publishedAt: string | null;
}> = ({ path, item }) => {
  return (
    <>
      <div className="flex items-center md:px-2">
        <Link
          className="relative size-10 shrink-0 overflow-hidden rounded bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
          href={path}
        >
          {item.image?.url ? (
            <Image
              src={item.image.url}
              alt=""
              fill
              className="object-contain p-1"
              sizes="40px"
            />
          ) : null}
        </Link>
      </div>
      <div className="flex min-w-0 flex-col">
        <Link className="text-lg" href={path}>
          {item.title}
        </Link>
        <MetaDates createdAt={item.createdAt} updatedAt={item.updatedAt} />
      </div>
    </>
  );
};

export default ListItem;

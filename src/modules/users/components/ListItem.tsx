"use client";

import Link from "next/link";

import MetaDates from "@kenstack/admin/components/MetaDates";
import { type ListItemComponent } from "@kenstack/admin/client";
import Avatar from "@kenstack/components/Avatar";
import { type SelectedImage } from "@kenstack/db/tables";

function getInitials(givenName: string, familyName: string) {
  return givenName.slice(0, 1) + familyName.slice(0, 1);
}

const ListItem: ListItemComponent<{
  avatar: SelectedImage | null;
  email: string;
  familyName: string;
  givenName: string;
}> = ({ path, item }) => {
  const name = [item.givenName, item.familyName].filter(Boolean).join(" ");

  return (
    <>
      <div className="flex items-center md:px-2">
        <Link href={path}>
          <Avatar
            initials={getInitials(item.givenName, item.familyName)}
            url={item.avatar?.url}
            className="size-10 shrink-0"
          />
        </Link>
      </div>
      <div className="flex min-w-0 flex-col">
        <Link className="text-lg" href={path}>
          {name || item.email}
        </Link>
        <MetaDates createdAt={item.createdAt} updatedAt={item.updatedAt} />
      </div>
    </>
  );
};

export default ListItem;

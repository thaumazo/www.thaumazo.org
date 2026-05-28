"use client";

import { defineClient } from "@kenstack/admin";
import MetaDates from "@kenstack/admin/components/MetaDates";
import Avatar from "@kenstack/components/Avatar";
import type { SelectedImage } from "@kenstack/db/tables";
import Link from "next/link";
import EditForm from "./components/EditForm";
import { fields } from "./fields";
import type { users } from "./tables";

type UserListFields = Pick<
  typeof users.$inferSelect,
  "email" | "familyName" | "givenName"
> & {
  avatar?: SelectedImage | null;
};

export const client = defineClient<UserListFields>({
  admin: {
    fields,
    listItems: [
      [
        (row) => {
          return (
            <Link href={row.path}>
              <Avatar
                initials={
                  row.givenName.slice(0, 1) + row.familyName.slice(0, 1)
                }
                url={row.avatar?.url}
                className="size-8 shrink-0"
              />
            </Link>
          );
        },
        { className: "flex items-center", column: "auto" },
      ],
      [
        (row) => {
          const name = [row.givenName, row.familyName].filter(Boolean).join(" ");

          return (
            <div className="flex min-w-0 flex-col">
              <Link className="text-lg" href={row.path}>
                {name || row.email}
              </Link>
              <MetaDates createdAt={row.createdAt} updatedAt={row.updatedAt} />
            </div>
          );
        },
      ],
      [
        (row) => row.email,
        { className: "hidden self-center sm:block" },
      ],
    ],
    EditForm,
  },
});

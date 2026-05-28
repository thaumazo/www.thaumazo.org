import { NotebookPen } from "lucide-react";

import { defineModule } from "@kenstack/admin";
import {
  mediaListField,
  serverFields,
  tagField as serverTagField,
} from "@kenstack/fields/server";
import { client } from "./client";
import { fields } from "./fields";
import { blog as blogTable, blog_media, blog_tags } from "./tables";

export const blog = defineModule({
  name: "blog",
  icon: NotebookPen,
  client,
  basePath: "/blog",
  admin: {
    table: blogTable,
    fields: serverFields(fields, {
      tags: serverTagField({ table: blog_tags }),
      media: mediaListField({ table: blog_media }),
    }),
    revalidate: ["blog", ({ slug }: { slug: string }) => `blog:${slug}`],
    list: {
      sort: {
        title: {
          fields: ["title"],
        },
      },
    },
    preview: `/blog/${"${slug}"}`,
  },
});

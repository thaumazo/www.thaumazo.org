import { defineFields } from "@kenstack/admin/fields";
import {
  imageField,
  mediaListField,
  slugField,
  tagField,
  textField,
} from "@kenstack/fields/client";
import * as z from "zod";

export const fields = defineFields({
  publish: true,
  seo: true,
  fields: {
    title: textField({
      list: true,
      searchable: true,
      zod: z.string().min(1, "Please enter a title"),
    }),
    slug: slugField({
      list: true,
    }),
    image: imageField({ list: "square" }),
    media: mediaListField(),
    description: textField({ searchable: true }),
    content: textField({ searchable: true, zod: z.string().trim() }),
    tags: tagField(),
  },
});

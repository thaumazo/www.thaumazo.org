import { defineFields } from "@kenstack/admin/fields";
import {
  imageField,
  markdownField,
  relationshipField,
  slugField,
  tagField,
  textField,
  textareaField,
} from "@kenstack/fields/client";
import * as z from "zod";

export const fields = defineFields({
  publish: true,
  seo: true,
  fields: {
    title: textField({
      list: true,
      zod: z.string().min(1, "Please enter a title"),
      searchable: true,
    }),
    slug: slugField(),
    image: imageField({ list: "square" }),
    description: textareaField({ searchable: true }),
    content: markdownField({ searchable: true }),
    tags: tagField(),
    liaisons: relationshipField(),
  },
});

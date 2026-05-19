import { defineFields, metaFieldOptions } from "@kenstack/admin";
import * as z from "zod";

export const fields = defineFields({
  ...metaFieldOptions,
  title: {
    default: "",
    zod: z.string().min(1, "Please enter a title"),
    searchable: true,
  },
  slug: {
    default: "",
    zod: z.string().min(1, "Slug is required"),
  },
  image: { kind: "image" },
  description: { default: "", zod: z.string(), searchable: true },
  content: { default: "", zod: z.string(), searchable: true },
  tags: { kind: "tags" },
  liaisons: { kind: "relationship" },
});

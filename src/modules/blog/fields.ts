import { defineFields } from "@kenstack/admin";
import * as z from "zod";
import { tags } from "@kenstack/schemas/atoms";

export const fields = defineFields({
  publishedAt: {
    default: "",
    zod: z.string().datetime({ precision: 3 }).or(z.literal("")),
    serverZod: z
      .string()
      .transform((val) => (val === "" ? new Date() : val))
      .pipe(z.coerce.date()),
  },
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
  gallery: { kind: "gallery" },
  description: { default: "", zod: z.string(), searchable: true },
  content: { default: "", zod: z.string(), searchable: true },
  tags: { default: [], zod: tags() },
  draft: { default: false, zod: z.boolean() },
  seoTitle: { default: "", zod: z.string(), searchable: true },
  seoDescription: { default: "", zod: z.string(), searchable: true },
});

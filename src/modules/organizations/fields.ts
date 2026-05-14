import { defineFields } from "@kenstack/admin";
import { tags } from "@kenstack/schemas/atoms";
import * as z from "zod";
import {
  sdgNameOptions,
  sdgOptions,
  sdgValues,
} from "@/modules/projects/fields";

export const organizationKindValues = [
  "Client",
  "Liaising",
  "Partner",
  "Partners",
  "Project Partners",
] as const;

export const organizationKindOptions = organizationKindValues.map(
  (value): [string, string] => [value, value],
);

const optionalDate = z.preprocess(
  (val) => (val === "" ? null : val),
  z.coerce.date().nullable(),
);

export { sdgNameOptions, sdgOptions };

export const fields = defineFields({
  publishedAt: {
    default: "",
    zod: z.string().datetime({ precision: 3 }).or(z.literal("")),
    serverZod: optionalDate,
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
  description: { default: "", zod: z.string(), searchable: true },
  content: { default: "", zod: z.string(), searchable: true },
  tags: { default: [], zod: tags() },
  draft: { default: true, zod: z.boolean() },
  url: { default: "", zod: z.url().or(z.literal("")) },
  kind: { default: [], zod: z.array(z.enum(organizationKindValues)) },
  sdgs: { default: [], zod: z.array(z.enum(sdgValues)) },
  seoTitle: { default: "", zod: z.string(), searchable: true },
  seoDescription: { default: "", zod: z.string(), searchable: true },
  // members: { kind: "relationship" },
  liaisons: { kind: "relationship" },
  // projects: { kind: "relationship" },
});

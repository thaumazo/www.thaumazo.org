import { defineFields, metaFieldOptions } from "@kenstack/admin";
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

export { sdgNameOptions, sdgOptions };

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
  url: { default: "", zod: z.url().or(z.literal("")) },
  kind: { default: [], zod: z.array(z.enum(organizationKindValues)) },
  sdgs: { default: [], zod: z.array(z.enum(sdgValues)) },
  // members: { kind: "relationship" },
  liaisons: { kind: "relationship" },
  // projects: { kind: "relationship" },
});

import { metaFieldOptions } from "@kenstack/admin";
import { defineFields } from "@kenstack/fields";
import {
  checkboxListField,
  imageField,
  markdownField,
  relationshipField,
  slugField,
  tagField,
  textField,
  textareaField,
} from "@kenstack/fields/client";
import * as z from "zod";
import { sdgNameOptions, sdgOptions } from "@/modules/projects/fields";

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
  url: textField({ zod: z.url().or(z.literal("")) }),
  kind: checkboxListField({ options: organizationKindOptions }),
  sdgs: checkboxListField({ options: sdgNameOptions }),
  // members: { kind: "relationship" },
  liaisons: relationshipField(),
  // projects: { kind: "relationship" },
});

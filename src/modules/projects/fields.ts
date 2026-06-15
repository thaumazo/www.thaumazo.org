import { metaFieldOptions } from "@kenstack/admin";
import { defineFields } from "@kenstack/fields";
import {
  checkboxListField,
  dateTimeField,
  imageField,
  markdownField,
  relationshipField,
  slugField,
  tagField,
  textField,
  textareaField,
} from "@kenstack/fields/client";
import * as z from "zod";

export const sdgValues = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
] as const;

export const projectStatusValues = [
  "Proposed",
  "Exploring",
  "Approved",
  "In Progress",
  "Completed",
] as const;

export const projectKindValues = [
  "Annual",
  "Client",
  "Internal",
  "Liaising",
  "Partner",
  "Partners",
  "Project Partners",
] as const;

export const sdgOptions = sdgValues.map((value) => ({
  value,
  label: value,
}));

export const sdgNameOptions = [
  { value: "1", label: "1 No Poverty" },
  { value: "2", label: "2 Zero Hunger" },
  { value: "3", label: "3 Good Health and Well-Being" },
  { value: "4", label: "4 Quality Education" },
  { value: "5", label: "5 Gender Equality" },
  { value: "6", label: "6 Clean Water and Sanitation" },
  { value: "7", label: "7 Affordable and Clean Energy" },
  { value: "8", label: "8 Decent Work and Economic Growth" },
  { value: "9", label: "9 Industry, Innovation and Infrastructure" },
  { value: "10", label: "10 Reduced Inequalities" },
  { value: "11", label: "11 Sustainable Cities and Communities" },
  { value: "12", label: "12 Responsible Consumption and Production" },
  { value: "13", label: "13 Climate Action" },
  { value: "14", label: "14 Life Below Water" },
  { value: "15", label: "15 Life on Land" },
  { value: "16", label: "16 Peace, Justice and Strong Institutions" },
  { value: "17", label: "17 Partnerships for the Goals" },
];

export const projectStatusOptions = projectStatusValues.map(
  (value) => ({ value, label: value }),
);
export const projectKindOptions = projectKindValues.map(
  (value) => ({ value, label: value }),
);

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
  location: textField({ searchable: true }),
  startDate: dateTimeField({ filter: true }),
  endDate: dateTimeField({ filter: true }),
  status: textField({
    default: "Proposed",
    zod: z.enum(projectStatusValues),
  }),
  kind: checkboxListField({ options: projectKindOptions }),
  sdgs: checkboxListField({ options: sdgNameOptions }),
  liaisons: relationshipField(),
  organizations: relationshipField(),
});

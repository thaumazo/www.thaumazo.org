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

export const sdgOptions = sdgValues.map((value): [string, string] => [
  value,
  value,
]);

export const sdgNameOptions: [string, string][] = [
  ["1", "1 No Poverty"],
  ["2", "2 Zero Hunger"],
  ["3", "3 Good Health and Well-Being"],
  ["4", "4 Quality Education"],
  ["5", "5 Gender Equality"],
  ["6", "6 Clean Water and Sanitation"],
  ["7", "7 Affordable and Clean Energy"],
  ["8", "8 Decent Work and Economic Growth"],
  ["9", "9 Industry, Innovation and Infrastructure"],
  ["10", "10 Reduced Inequalities"],
  ["11", "11 Sustainable Cities and Communities"],
  ["12", "12 Responsible Consumption and Production"],
  ["13", "13 Climate Action"],
  ["14", "14 Life Below Water"],
  ["15", "15 Life on Land"],
  ["16", "16 Peace, Justice and Strong Institutions"],
  ["17", "17 Partnerships for the Goals"],
];

export const projectStatusOptions = projectStatusValues.map(
  (value): [string, string] => [value, value],
);
export const projectKindOptions = projectKindValues.map(
  (value): [string, string] => [value, value],
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

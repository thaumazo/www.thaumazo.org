import { defineFields, metaFieldOptions } from "@kenstack/admin";
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
  location: { default: "", zod: z.string(), searchable: true },
  startDate: {
    default: "",
    zod: z.string().datetime({ precision: 3 }).or(z.literal("")),
    serverZod: metaFieldOptions.publishedAt.serverZod,
  },
  endDate: {
    default: "",
    zod: z.string().datetime({ precision: 3 }).or(z.literal("")),
    serverZod: metaFieldOptions.publishedAt.serverZod,
  },
  status: { default: "Proposed", zod: z.enum(projectStatusValues) },
  kind: { default: [], zod: z.array(z.enum(projectKindValues)) },
  sdgs: { default: [], zod: z.array(z.enum(sdgValues)) },
  liaisons: { kind: "relationship" },
  organizations: { kind: "relationship" },
});

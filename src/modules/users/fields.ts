import { userFieldOptions } from "@kenstack/modules/users/fields";
import { defineFields } from "@kenstack/admin";
import * as z from "zod";

const communityRoleValues = [
  "Community Member",
  "Director",
  "Liaison",
  "Project Lead",
  "Project Member",
  "Volunteer",
] as const;

export const communityRoleOptions = communityRoleValues.map(
  (value): [string, string] => [value, value],
);

export const fields = defineFields({
  ...userFieldOptions,
  title: {
    default: "",
    zod: z.string(),
    searchable: true,
  },
  slug: {
    default: "",
    zod: z.string(),
    searchable: true,
  },
  publishedAt: {
    default: "",
    zod: z.string().datetime({ precision: 3 }).or(z.literal("")),
    serverZod: z.preprocess(
      (val) => (val === "" ? null : val),
      z.coerce.date().nullable(),
    ),
  },
  description: {
    default: "",
    zod: z.string(),
    searchable: true,
  },
  content: {
    default: "",
    zod: z.string(),
    searchable: true,
  },
  draft: { default: true, zod: z.boolean() },
  linkedin: {
    default: "",
    zod: z.url().or(z.literal("")),
  },
  communityRoles: {
    default: [],
    zod: z.array(z.enum(communityRoleValues)),
  },
  seoTitle: { default: "", zod: z.string(), searchable: true },
  seoDescription: { default: "", zod: z.string(), searchable: true },
  organizations: { kind: "relationship" },
  projects: { kind: "relationship" },
});

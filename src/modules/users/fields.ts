import { userFieldOptions } from "@kenstack/modules/users/fields";
import { defineFields } from "@kenstack/admin";
import * as z from "zod";

const communityRoleValues = [
  "Community Member",
  "Director",
  "Liaison",
  "Project Lead",
  "Project Member",
  "Team Lead",
  "Team Member",
  "Volunteer",
] as const;

const legacyCommunityRoleValues = ["Liaisonr"] as const;

const communityRolesSchema = z
  .array(z.enum([...communityRoleValues, ...legacyCommunityRoleValues]))
  .transform((values) =>
    Array.from(
      new Set(
        values.map((value) => (value === "Liaisonr" ? "Liaison" : value)),
      ),
    ),
  );

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
    zod: communityRolesSchema,
  },
  seoTitle: { default: "", zod: z.string(), searchable: true },
  seoDescription: { default: "", zod: z.string(), searchable: true },
  organizations: { kind: "relationship" },
  projects: { kind: "relationship" },
});

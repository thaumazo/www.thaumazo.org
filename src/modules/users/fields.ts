import roles from "@app/deps/roles";
import { metaFieldOptions } from "@kenstack/admin";
import { defineFields } from "@kenstack/fields";
import {
  checkboxListField,
  emailField,
  imageField,
  markdownField,
  slugField,
  textField,
  textareaField,
} from "@kenstack/fields/client";
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
  givenName: textField({
    zod: z.string().min(1, "Given name is required"),
    searchable: true,
    list: true,
    filter: true,
  }),
  familyName: textField({
    zod: z.string().min(1, "Family name is required"),
    searchable: true,
    list: true,
    filter: true,
  }),
  email: emailField({
    searchable: true,
    list: true,
    filter: true,
  }),
  avatar: imageField({ list: "square" }),
  roles: checkboxListField({ options: roles }),
  title: textField({
    searchable: true,
  }),
  slug: slugField({
    searchable: true,
  }),
  ...metaFieldOptions,
  description: textareaField({
    searchable: true,
  }),
  content: markdownField({
    searchable: true,
  }),
  linkedin: textField({
    zod: z.url().or(z.literal("")),
  }),
  communityRoles: checkboxListField({
    options: communityRoleOptions,
    zod: communityRolesSchema,
  }),
});

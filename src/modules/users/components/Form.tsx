"use client";

import {
  CheckboxField,
  CheckboxList,
  DateField,
  ImageField,
  InputField,
  MarkdownField,
  SlugField,
  TextareaField,
} from "@kenstack/admin/forms";
import ResetPassword from "@kenstack/modules/users/components/ResetPassword";
import SwitchUser from "@kenstack/modules/users/components/SwitchUser";

import { communityRoleOptions } from "../fields";
import roles from "@app/deps/roles";

export default function UserForm() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ImageField
              label="Avatar"
              name="avatar"
              imageClass="rounded-full"
            />
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                <InputField name="givenName" label="Given Name" />
                <InputField name="familyName" label="Family Name" />
              </div>
              <InputField
                className="md:col-span-2"
                name="email"
                label="Email"
                type="email"
              />
            </div>
          </div>
        </div>

        <InputField label="Profile Title" name="title" />
        <SlugField
          label="Profile Slug"
          name="slug"
          watch={["givenName", "familyName"]}
        />
        <TextareaField label="Description" name="description" />
        <MarkdownField label="Profile Content" name="content" />
        <InputField
          label="SEO Title (If different than Title)"
          name="seoTitle"
        />
        <TextareaField
          label="SEO Description (if different than Description)"
          name="seoDescription"
        />
      </div>

      <div className="space-y-4">
        <CheckboxField label="Hidden" name="draft" />
        <DateField name="publishedAt" label="Publish On" />
        <InputField label="LinkedIn" name="linkedin" type="url" />
        <CheckboxList name="roles" label="Access Roles" options={roles} />
        <CheckboxList
          name="communityRoles"
          label="Roles"
          options={communityRoleOptions}
        />
        <SwitchUser />
        <ResetPassword />
      </div>
    </div>
  );
}

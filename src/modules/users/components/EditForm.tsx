"use client";

import {
  CheckboxList,
  ImageField,
  InputField,
  MarkdownField,
  SlugField,
  TextareaField,
} from "@kenstack/admin/forms";
import MetaFields from "@kenstack/admin/components/MetaFields";
import ResetPassword from "@kenstack/modules/users/components/ResetPassword";

import { communityRoleOptions } from "../fields";
import roles from "@app/deps/roles";

export default function UserForm() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ImageField name="avatar" imageClass="rounded-full" />
          <div className="flex w-full flex-1 flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <InputField name="givenName" label="Given Name" />
              <InputField name="familyName" label="Family Name" />
            </div>
            <InputField name="email" label="Email" type="email" />
          </div>
        </div>
        <InputField label="Profile Title" name="title" />
        <SlugField
          label="Profile Slug"
          name="slug"
          watch={["givenName", "familyName"]}
        />
      </div>

      <div className="space-y-4">
        <MetaFields fields={{ visibility: true }} />
      </div>

      <div className="space-y-4 lg:col-span-2">
        <TextareaField label="Description" name="description" />
        <MarkdownField label="Profile Content" name="content" />
      </div>

      <div className="space-y-4">
        <MetaFields
          fields={{
            publishedAt: true,
            seoTitle: true,
            seoDescription: true,
            ogImage: true,
          }}
        />
        <InputField label="LinkedIn" name="linkedin" type="url" />
        <CheckboxList name="roles" label="Access Roles" options={roles} />
        <CheckboxList
          name="communityRoles"
          label="Roles"
          options={communityRoleOptions}
        />
        <ResetPassword />
      </div>
    </div>
  );
}

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
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
        </div>
        <div className="space-y-4">
          <MetaFields />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          <InputField label="Profile Title" name="title" />
          <SlugField
            label="Profile Slug"
            name="slug"
            watch={["givenName", "familyName"]}
          />
          <TextareaField label="Description" name="description" />
          <MarkdownField label="Profile Content" name="content" />
        </div>

        <div className="space-y-4">
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
    </div>
  );
}

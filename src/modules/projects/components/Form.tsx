"use client";

import {
  CheckboxField,
  CheckboxList,
  DateField,
  ImageField,
  InputField,
  MarkdownField,
  RelationshipField,
  SlugField,
  TagField,
  TextareaField,
} from "@kenstack/admin/forms";
import SdgComboboxField from "@/components/forms/SdgComboboxField";
import {
  projectKindOptions,
  projectStatusOptions,
  sdgNameOptions,
} from "../fields";
import StatusField from "./StatusField";

export default function ProjectForm() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="flex gap-4">
          <ImageField label="Image" name="image" />
          <div className="flex-1 space-y-4">
            <InputField label="Title" name="title" />
            <SlugField label="Slug" name="slug" />
            <InputField label="URL" name="url" type="url" />
          </div>
        </div>
        <TextareaField label="Description" name="description" />
        <MarkdownField label="Content" name="content" />
      </div>

      <div className="space-y-4">
        <CheckboxField label="Hidden" name="draft" />
        <DateField name="publishedAt" label="Publish On" />
        <DateField name="startDate" label="Start Date" />
        <DateField name="endDate" label="End Date" />
        <InputField label="Location" name="location" />
        <StatusField
          name="status"
          label="Status"
          options={projectStatusOptions}
        />
        <CheckboxList name="kind" label="Kind" options={projectKindOptions} />
        <SdgComboboxField name="sdgs" label="SDGs" options={sdgNameOptions} />
        <TagField label="Tags" name="tags" />
        <RelationshipField
          name="liaisons"
          label="Liaisons"
          relationship="liaisons"
          placeholder="Search users..."
        />
        <RelationshipField
          name="organizations"
          label="Organizations"
          relationship="organizations"
          placeholder="Search organizations..."
        />

        <InputField
          label="SEO Title (If different than Title)"
          name="seoTitle"
        />
        <TextareaField
          label="SEO Description (if different than Description)"
          name="seoDescription"
        />
      </div>
    </div>
  );
}

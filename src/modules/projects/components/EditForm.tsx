"use client";

import {
  CheckboxList,
  DateTimeField,
  ImageField,
  InputField,
  MarkdownField,
  RelationshipField,
  SlugField,
  TagField,
  TextareaField,
} from "@kenstack/admin/forms";
import MetaFields from "@kenstack/admin/components/MetaFields";
import SdgComboboxField from "@/components/forms/SdgComboboxField";
import {
  projectKindOptions,
  projectStatusOptions,
  sdgNameOptions,
} from "../fields";
import StatusField from "./StatusField";

export default function ProjectForm() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ImageField name="image" />
          <div className="flex-1 space-y-4">
            <InputField label="Title" name="title" />
            <SlugField label="Slug" name="slug" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <MetaFields fields={{ visibility: true }} />
      </div>

      <div className="space-y-4 lg:col-span-2">
        <InputField label="URL" name="url" type="url" />
        <TextareaField label="Description" name="description" />
        <MarkdownField label="Content" name="content" />
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
        <DateTimeField name="startDate" label="Start Date" />
        <DateTimeField name="endDate" label="End Date" />
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
      </div>
    </div>
  );
}

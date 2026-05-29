"use client";

import {
  ImageField,
  InputField,
  MarkdownField,
  RelationshipField,
  SlugField,
  TagField,
  TextareaField,
} from "@kenstack/admin/forms";
import MetaFields from "@kenstack/admin/components/MetaFields";

export default function ServiceForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex gap-4">
            <ImageField label="Image" name="image" />
            <div className="flex-1 space-y-4">
              <InputField label="Title" name="title" />
              <SlugField label="Slug" name="slug" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <MetaFields />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          <TextareaField label="Description" name="description" />
          <MarkdownField label="Content" name="content" />
        </div>

        <div className="space-y-4">
          <TagField label="Tags" name="tags" />
          <RelationshipField
            name="liaisons"
            label="Liaisons"
            relationship="liaisons"
            placeholder="Search users..."
          />
        </div>
      </div>
    </div>
  );
}

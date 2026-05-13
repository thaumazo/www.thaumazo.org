"use client";

import {
  CheckboxField,
  DateField,
  ImageField,
  InputField,
  MarkdownField,
  RelationshipField,
  SlugField,
  TagField,
  TextareaField,
} from "@kenstack/admin/forms";

export default function ServiceForm() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="flex gap-4">
          <ImageField label="Image" name="image" />
          <div className="flex-1 space-y-4">
            <InputField label="Title" name="title" />
            <SlugField label="Slug" name="slug" />
          </div>
        </div>
        <TextareaField label="Description" name="description" />
        <MarkdownField label="Content" name="content" />
      </div>

      <div className="space-y-4">
        <CheckboxField label="Hidden" name="draft" />
        <DateField name="publishedAt" label="Publish On" />
        <TagField label="Tags" name="tags" />
        <RelationshipField
          name="liaisons"
          label="Liaisons"
          relationship="liaisons"
          placeholder="Search users..."
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

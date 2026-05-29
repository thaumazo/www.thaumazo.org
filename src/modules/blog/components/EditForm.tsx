"use client";

import {
  InputField,
  ImageField,
  MediaListField,
  SlugField,
  MarkdownField,
  TagField,
  TextareaField,
} from "@kenstack/admin/forms";
import MetaFields from "@kenstack/admin/components/MetaFields";

export function BlogForm() {
  return (
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
      <div className="space-y-4 lg:col-start-3 lg:row-span-2">
        <MetaFields />
        <TagField label="Tags" name="tags" />
      </div>
      <div className="space-y-4 lg:col-span-2 lg:col-start-1">
        <TextareaField label="Description" name="description" />
        <MediaListField label="Media" name="media" />
        <MarkdownField label="Content" name="content" />
      </div>
    </div>
  );
}

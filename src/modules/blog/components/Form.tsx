'use client';
import InputField from '@kenstack/forms/InputField';
import SlugField from '@kenstack/forms/SlugField';
import MarkdownField from '@kenstack/forms/MarkdownField';
// import TagField from '@kenstack/forms/TagField';
import CheckboxField from '@kenstack/forms/CheckboxField';
import TextareaField from '@kenstack/forms/TextareaField';
import ImageField from '@kenstack/forms/ImageField';
import DateField from '@kenstack/forms/DateField';

export default function BlogForm() {
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
        <CheckboxField label="Draft" name="draft" />
        <DateField name="publishedAt" label="Publish On" />
        {/* <TagField label="Tags" name="tags" /> */}
        <InputField label="SEO Title (If different than Title)" name="seoTitle" />
        <TextareaField
          label="SEO Description (if different than Description)"
          name="seoDescription"
        />
      </div>
    </div>
  );
}

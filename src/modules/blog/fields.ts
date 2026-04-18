import { defineFields } from '@kenstack/admin';
import * as z from 'zod';
import { /*tags, */ image } from '@kenstack/schemas/atoms';

export const fields = defineFields({
  publishedAt: {
    kind: 'timestamp',
    column: 'published_at',
    zod: z.string().datetime({ precision: 3 }).or(z.literal('')),
    serverZod: z
      .string()
      .transform((val) => (val === '' ? new Date() : val))
      .pipe(z.coerce.date()),
  },
  title: {
    zod: z.string().min(1, 'Please enter a title'),
    nullable: false,
    searchable: true,
  },
  slug: { zod: z.string().min(1, 'Slug is required'), nullable: false },
  image: { kind: 'jsonb', zod: image() },
  description: { searchable: true },
  content: { searchable: true },
  draft: { kind: 'boolean', default: false },
  seoTitle: { column: 'seo_title', searchable: true },
  seoDescription: { column: 'seo_description', searchable: true },
});

import { defineTable } from '@kenstack/admin/table';
import { sql } from 'drizzle-orm';
import { jsonb, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

import * as z from 'zod';
import { image } from '@kenstack/schemas/atoms';
type Image = z.infer<ReturnType<typeof image>>;
import { fields } from './fields';

export const blogs = defineTable({
  name: 'blogs',
  fields,
  columns: {
    publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
    // title: text('title').notNull(),
    // slug: text('slug').notNull(),

    image: jsonb('image').$type<Image>(),
    // description: text(),
    // content: text(),
    // draft: boolean().notNull(),
    // tags: tags(),
    // seoTitle: text('seo_title'),
    // seoDescription: text('seo_description'),
  },
  extraConfig: (t) => [
    index('blogs_published_at_idx')
      .on(t.publishedAt)
      .where(sql`${t.deletedAt} IS NULL`),

    uniqueIndex('blogs_slug_unique')
      .on(t.slug)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
});

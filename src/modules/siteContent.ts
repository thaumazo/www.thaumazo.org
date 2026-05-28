export type RelatedLink = {
  slug: string;
  title: string;
};

export function uniqueRelatedLinks(rows: RelatedLink[]) {
  const bySlug = new Map<string, RelatedLink>();

  for (const row of rows) {
    bySlug.set(row.slug, row);
  }

  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title));
}

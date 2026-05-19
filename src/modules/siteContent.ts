export type RelatedLink = {
  slug: string;
  title: string;
};

export type SiteSearchParams = Record<string, string | string[] | undefined>;

export function isPreviewRequest(searchParams: SiteSearchParams) {
  return searchParams.preview !== undefined;
}

export function uniqueRelatedLinks(rows: RelatedLink[]) {
  const bySlug = new Map<string, RelatedLink>();

  for (const row of rows) {
    bySlug.set(row.slug, row);
  }

  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title));
}

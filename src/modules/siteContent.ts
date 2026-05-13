import type { SelectedImage } from "@kenstack/db/tables";

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  kind: "raster" | "svg";
};

export type RelatedLink = {
  slug: string;
  title: string;
  draft?: boolean;
};

export function includeDraftContent() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview"
  );
}

export function toSiteImage(image: SelectedImage | null) {
  if (!image?.url) {
    return null;
  }

  return {
    src: image.url,
    width: image.width ?? 800,
    height: image.height ?? 800,
    alt: image.alt ?? "",
    kind: image.kind,
  };
}

export function uniqueRelatedLinks(rows: RelatedLink[]) {
  const bySlug = new Map<string, RelatedLink>();

  for (const row of rows) {
    bySlug.set(row.slug, row);
  }

  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title));
}

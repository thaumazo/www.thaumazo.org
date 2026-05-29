import Image from "next/image";
import NextLink from "next/link";
import { draftMode } from "next/headers";
import { ArrowRight } from "lucide-react";

import { AdminShortcutLink } from "@kenstack/admin/components/PageControls";
import { getSearchParam } from "@kenstack/admin/lib/searchParams";
import { blog } from "@/modules/blog";
import { loadBlogList } from "@/modules/blog/queries";

export async function Posts({
  searchParams = {},
}: {
  searchParams?: unknown | Promise<unknown>;
}) {
  const [query, { isEnabled: draft }] = await Promise.all([
    searchParams,
    draftMode(),
  ]);
  const tag = getSearchParam(query, "tag");
  const posts = await loadBlogList({
    draft,
    tag,
  });
  const adminLink = (
    <AdminShortcutLink
      href={`/admin/${blog.name}`}
      label={`Edit ${blog.title}`}
    />
  );

  if (posts.length === 0) {
    if (tag) {
      return (
        <div className="relative">
          {adminLink}
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      );
    }

    return <div className="relative">{adminLink}</div>;
  }

  return (
    <div className="relative">
      {adminLink}
      <div className="grid max-w-6xl grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(
          ({ slug, title, description, publishedAt, image }, index) => {
            const searchParams = new URLSearchParams();
            if (tag) {
              searchParams.set("tag", tag);
            }

            const query = searchParams.toString();
            const href = `${blog.basePath}/${slug}${query ? `?${query}` : ""}`;

            return (
              <article
                className="group hover:bg-muted/40 flex h-full flex-col gap-3 rounded-md p-3 transition-colors"
                key={slug}
              >
                {image ? (
                  <NextLink
                    href={href}
                    className="relative block aspect-square overflow-hidden rounded-md bg-gray-100"
                  >
                    <Image
                      src={image.url}
                      width={image.width ?? 800}
                      height={image.height ?? 800}
                      alt={image.alt ?? ""}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(min-width: 1024px) 288px, (min-width: 768px) 50vw, 100vw"
                      unoptimized={image.kind === "svg"}
                    />
                  </NextLink>
                ) : (
                  <div className="aspect-square rounded-md bg-gray-100" />
                )}
                {publishedAt && (
                  <time
                    className="text-muted-foreground text-sm"
                    dateTime={publishedAt.toISOString()}
                  >
                    {publishedAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                )}
                <NextLink
                  href={href}
                  className="text-2xl leading-tight whitespace-normal"
                >
                  {title}
                </NextLink>
                {description ? (
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-6">
                    {description}
                  </p>
                ) : null}
                <NextLink
                  href={href}
                  className="text-primary mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
                >
                  Read post
                  <ArrowRight className="size-4" />
                </NextLink>
              </article>
            );
          },
        )}
      </div>
    </div>
  );
}

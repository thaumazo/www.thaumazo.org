import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import Markdown from "@kenstack/components/Markdown";
import { getSearchParam } from "@kenstack/admin/lib/searchParams";
import { AdminRecordShortcutLink } from "@kenstack/admin/components/PageControls";
import { blog } from "@/modules/blog";
import { loadBlogPage } from "@/modules/blog/queries";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: unknown | Promise<unknown>;
};

export function BlogPostPage(props: BlogPostPageProps) {
  return (
    <Suspense fallback={null}>
      <BlogPostLoader {...props} />
    </Suspense>
  );
}

async function BlogPostLoader({ params, searchParams }: BlogPostPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  return <BlogPost slug={slug} tag={getSearchParam(query, "tag")} />;
}

async function BlogPost({
  slug,
  tag,
}: {
  slug: string;
  tag?: string;
}) {
  const draft = (await draftMode()).isEnabled;
  const post = await loadBlogPage(slug, {
    draft,
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="relative mx-auto my-8 flex max-w-5xl flex-col gap-8 px-4">
      <AdminRecordShortcutLink
        moduleName={blog.name}
        id={post.id}
        title={post.title}
      />
      <article className="flex flex-col gap-8">
        <header className="flex max-w-4xl flex-col gap-4">
          <Link
            href={
              tag
                ? `${blog.basePath}?tag=${encodeURIComponent(tag)}`
                : blog.basePath
            }
            className="text-muted-foreground flex w-fit items-center gap-2 text-sm underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to list
          </Link>
          {post.publishedAt ? (
            <time
              className="text-muted-foreground text-sm"
              dateTime={post.publishedAt.toISOString()}
            >
              {post.publishedAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          ) : null}
          <h1 className="text-4xl leading-tight">{post.title}</h1>
          {post.description ? (
            <p className="text-muted-foreground text-lg leading-8">
              {post.description}
            </p>
          ) : null}
        </header>
        <div className="max-w-4xl">
          {post.image ? (
            <figure
              className={
                post.content
                  ? "mb-6 w-full lg:float-right lg:ml-8 lg:w-96"
                  : "mb-6 w-full"
              }
            >
              <Image
                src={post.image.url}
                width={post.image.width ?? 800}
                height={post.image.height ?? 800}
                alt={post.image.alt || post.title}
                className="aspect-square w-full rounded-md object-cover"
                sizes="(min-width: 1024px) 384px, 100vw"
                unoptimized={post.image.kind === "svg"}
              />
              {post.image.caption ? (
                <figcaption className="text-muted-foreground mt-2 text-sm leading-6">
                  {post.image.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
          {post.content ? (
            <Markdown
              className="markdown text-justify"
              content={post.content}
            />
          ) : null}
        </div>
        {post.tags.length > 0 ? (
          <div className="clear-both flex max-w-4xl flex-wrap items-center gap-3 border-t pt-6">
            <span className="text-muted-foreground text-sm">Tagged</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ name, slug }) => (
                <Link
                  href={`${blog.basePath}?tag=${encodeURIComponent(slug)}`}
                  key={slug}
                  className="rounded-full border px-3 py-1 text-sm font-normal"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </main>
  );
}

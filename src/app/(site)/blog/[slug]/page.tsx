import { Suspense } from "react";

import { blog } from "@/modules/blog";
import { buildMetadata } from "@kenstack/admin";
import BlogPost from "@kenstack/modules/blog/components/Page";
import { getBlog } from "@kenstack/modules/blog/queries";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, unknown>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const post = await getBlog(blog.tables.tableName, slug, {
    preview: query.preview !== undefined,
    name: blog.name,
    prefix: blog.tables.prefix,
  });

  return buildMetadata(post);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, unknown>>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={null}>
      <BlogPost module={blog} slug={slug} searchParams={searchParams} />
    </Suspense>
  );
}

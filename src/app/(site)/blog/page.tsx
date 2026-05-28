import { Suspense } from "react";

import { Main } from "@/components/Main";
import { blog } from "@/modules/blog";
import { Posts as BlogPosts } from "@/modules/blog/components/Posts";
import { loadMeta } from "@kenstack/admin/pageEditor";

const defaultValues = {
  title: "Blog",
  content:
    "Read updates, notes, and articles from the site. Use Kenstack to publish posts with tags, images, metadata, and editor-managed content.",
};

export const generateMetadata = () => loadMeta(blog.name, { defaultValues });

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  return (
    <>
      <Main
        slug={blog.name}
        defaultValues={defaultValues}
        className="mx-auto mt-14 max-w-3xl px-4 text-center [&_.markdown]:text-justify [&_h1]:text-center"
      />
      <section className="mx-auto mt-8 mb-16 max-w-6xl px-4">
        <Suspense fallback={null}>
          <BlogPosts searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

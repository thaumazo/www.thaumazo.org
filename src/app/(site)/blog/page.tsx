import { Suspense } from "react";

import { Main } from "@/components";
import { blog } from "@/modules/blog";
import BlogPosts from "@kenstack/modules/blog/components/Posts";
import { loadMeta } from "@kenstack/pageEditor";

const defaultValues = {
  title: "Blog",
  content: "",
};

export const generateMetadata = () => loadMeta(blog.name, { defaultValues });

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  return (
    <>
      <Main
        slug={blog.name}
        defaultValues={defaultValues}
        className="mx-auto mt-14 max-w-3xl px-4 text-center [&_.markdown]:text-justify [&_h1]:text-center"
      />
      <main className="mx-auto mb-16 max-w-6xl px-4">
        <Suspense fallback={null}>
          <BlogPosts module={blog} searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

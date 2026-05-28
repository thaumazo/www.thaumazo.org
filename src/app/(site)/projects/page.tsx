import { Suspense } from "react";

import { Main } from "@/components";
import Posts from "@/modules/projects/components/Posts";
import { loadMeta } from "@kenstack/admin/pageEditor";

const slug = "projects";
const defaultValues = {
  title: "Projects",
  content: "",
};

export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function page() {
  return (
    <>
      <Main
        slug={slug}
        defaultValues={defaultValues}
        className="mx-auto mt-14 max-w-3xl px-4 text-center [&_.markdown]:text-justify [&_h1]:text-center"
      />
      <Suspense fallback={null}>
        <Posts />
      </Suspense>
    </>
  );
}

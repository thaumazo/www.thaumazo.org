import { Main } from "@/components";
import { loadMeta } from "@kenstack/pageEditor";
import { Suspense } from "react";

import Posts from "@/modules/users/components/Posts";

const slug = "community";
const defaultValues = {
  title: "Community",
  content: "",
};

export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function CommunityPage() {
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

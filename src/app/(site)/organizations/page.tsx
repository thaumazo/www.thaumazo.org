import { Main } from "@/components";
import { Suspense } from "react";

import Posts from "@/modules/organizations/components/Posts";
import { loadMeta } from "@kenstack/pageEditor";

const slug = "organizations";
const defaultValues = {
  title: "Organizations",
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

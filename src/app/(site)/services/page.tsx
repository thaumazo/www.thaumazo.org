import { Main } from "@/components";
import { loadMeta } from "@kenstack/pageEditor";
import { Suspense } from "react";

import Posts from "@/modules/services/components/Posts";

const slug = "services";
const defaultValues = {
  title: "What We Offer",
  content: "",
};

export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function Page() {
  return (
    <div className="container flex flex-col gap-6">
      <Main
        slug={slug}
        defaultValues={defaultValues}
        className="mx-auto mt-14 max-w-3xl px-4 text-center [&_.markdown]:text-justify [&_h1]:text-center"
      />
      <Suspense fallback={null}>
        <Posts />
      </Suspense>
    </div>
  );
}

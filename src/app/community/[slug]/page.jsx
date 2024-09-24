import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/utils/loadMD";
import Markdown from "@kenstack/components/Markdown";

import { notFound } from "next/navigation";
import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";

export default async function Page({ params: { slug } }) {
  const data = await loadMD("community/people/" + slug);

  if (data === false) {
    notFound();
  }

  return (
    <>
      <SeoMeta {...data} />
      <main>
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-7 md:col-9 mb-8 text-center">
              <h1 className="mb-4 text-h3"> {data.title} </h1>

              <div className="inline-flex items-center justify-center w-48 h-48 mb-4 bg-gray-200 dark:bg-gray-800">
                <UserIcon className="w-24 h-24" />
              </div>

              <Markdown className="main-text mb-4" content={data.content} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

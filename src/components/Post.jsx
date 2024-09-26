import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/utils/loadMD";
import Markdown from "@kenstack/components/Markdown";

import { notFound } from "next/navigation";
import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";

import Image from "next/image";

export default async function Page({ file, defaultImage = null }) {
  const data = await loadMD(file);

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
              {data.image ? (
                <div className="flex justify-center mb-8">
                  <Image
                    {...data.image}
                    alt={data.image.alt || ""}
                    className="max-w-full max-h-full"
                  />
                </div>
              ) : (
                defaultImage
              )}

              <Markdown className="main-text mb-4" content={data.content} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
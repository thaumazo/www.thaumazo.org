import loadMD from "@/utils/loadMD";
import Markdown from "@kenstack/components/Markdown";

import { notFound } from "next/navigation";

export default async function Page({ params: { slug } }) {
  const data = await loadMD("projects/posts/" + slug);

  if (data === false) {
    notFound();
  }

  return (
    <main>
      <div className="container">
        <div className="row justify-center">
          <div className="lg:col-7 md:col-9 mb-8 text-center">
            <h1 className="mb-4 text-h3"> {data.title} </h1>

            <Markdown className="main-text mb-4" content={data.content} />
          </div>
        </div>
      </div>
    </main>
  );
}

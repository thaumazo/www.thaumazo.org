import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/utils/loadMD";
import Main from "@//components/Main";

import Form from "./Form";

// for all regular pages
export default async function CommunityPage() {
  const data = await loadMD("contact/_index.md");

  return (
    <>
      <SeoMeta {...data} />
      <Main {...data} />

      <section className="container my-4">
        <div className="row justify-center">
          <div className="lg:col-7 md:col-9">
            <Form />
          </div>
        </div>
      </section>
    </>
  );
}

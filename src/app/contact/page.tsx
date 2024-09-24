import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/utils/loadMD";
import Main from "@//components/Main";

import AutoForm from "@kenstack/forms/AutoForm";
import fields from "./fields";
import formAction from "./formAction";

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
            <AutoForm
              // title="Contact us"
              fields={fields}
              action={formAction}
              submit={
                {
                  className: "btn btn-primary",
                } as unknown as string
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}

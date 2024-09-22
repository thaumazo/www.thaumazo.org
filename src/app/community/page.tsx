import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/utils/loadMD";
import listMD from "@/utils/listMD";
import Main from "@//custom/Main";

// for all regular pages
export default async function CommunityPage() {
  const data = await loadMD("community/_index.md");
  const people = await listMD("community/people");

  return (
    <>
      <SeoMeta {...data} />
      <Main {...data} />
      <div className="container">
        <div className="row justify-center">
          <div className="lg:col-7 md:col-9  grid grid-cols-2 lg:grid-cols-3 gap-4">
            {people.map(({title, slug}) => {
              return <div key={slug}>{title}</div>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/lib/loadMD";
import Main from "@//custom/Main";

// for all regular pages
export default async function CommunityPage() {
  const data = await loadMD("community/_index.md");

  return (
    <>
      <SeoMeta {...data} />
      <Main {...data} />
    </>
  );
}

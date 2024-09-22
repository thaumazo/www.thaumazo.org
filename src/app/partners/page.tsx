import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/utils/loadMD";
import Main from "@//custom/Main";

// for all regular pages
export default async function CommunityPage() {
  const data = await loadMD("partners/_index.md");

  return (
    <>
      <SeoMeta {...data} />
      <Main {...data} />
    </>
  );
}

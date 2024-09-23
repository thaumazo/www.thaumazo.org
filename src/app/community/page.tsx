import SeoMeta from "@/partials/SeoMeta";

import loadMD from "@/utils/loadMD";
import Main from "@//custom/Main";

import Posts from "./Posts";

// for all regular pages
export default async function CommunityPage() {
  const data = await loadMD("community/_index.md");
  return (
    <>
      <SeoMeta {...data} />
      <Main {...data} />
      <Posts />
    </>
  );
}

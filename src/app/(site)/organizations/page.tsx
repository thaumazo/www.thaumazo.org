import { loadMD, loadMetadata } from "@/utils/loadMD";
import Main from "@/components/Main";

import Posts from "./Posts";
import { notFound } from "next/navigation";

export const metadata = loadMetadata("organizations/_index.md");

export default async function CommunityPage() {
  const data = await loadMD("organizations/_index.md");
  if (!data) {
    notFound();
  }

  return (
    <>
      <Main title={data.title} content={data.content} image={data.image} />
      <Posts />
    </>
  );
}

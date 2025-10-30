import { loadMD, loadMetadata } from "@/utils/loadMD";
import { notFound } from "next/navigation";
import Main from "@//components/Main";

import Posts from "./Posts";

export const metadata = loadMetadata("community/_index.md");

export default async function CommunityPage() {
  const data = await loadMD("community/_index.md");
  if (data === false) {
    notFound();
  }

  return (
    <>
      <Main title={data.title} content={data.content} image={data.image} />
      <Posts />
    </>
  );
}

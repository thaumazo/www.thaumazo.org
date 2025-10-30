import { loadMD, loadMetadata } from "@/utils/loadMD";

import Main from "@/components/Main";
import Posts from "./Posts";
import { notFound } from "next/navigation";

export const metadata = loadMetadata("projects/_index");

export default async function page() {
  const data = await loadMD("projects/_index");
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

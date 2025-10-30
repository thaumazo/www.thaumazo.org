import { loadMD, loadMetadata } from "@/utils/loadMD";
import Main from "@//components/Main";

import Form from "@/modules/contact/Form";
import { notFound } from "next/navigation";

export const metadata = loadMetadata("contact/_index.md");

export default async function CommunityPage() {
  const data = await loadMD("contact/_index.md");
  if (!data) {
    notFound();
  }

  return (
    <>
      <Main title={data.title} content={data.content} image={data.image} />
      <div className="flex max-w-3xl justify-center  mx-auto px-4 mt-4">
        <Form />
      </div>
    </>
  );
}

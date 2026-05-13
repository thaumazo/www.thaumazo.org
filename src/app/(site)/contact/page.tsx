import { Main } from "@/components";
import { loadMeta } from "@kenstack/pageEditor";

import Form from "@/modules/contact/Form";

const slug = "contact";
const defaultValues = {
  title: "Contact",
  content: "",
};

export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function CommunityPage() {
  return (
    <>
      <Main
        slug={slug}
        defaultValues={defaultValues}
        className="mx-auto mt-14 max-w-3xl px-4 text-center [&_.markdown]:text-justify [&_h1]:text-center"
      />
      <div className="flex max-w-3xl justify-center  mx-auto px-4 mt-4">
        <Form />
      </div>
    </>
  );
}

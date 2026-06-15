import { Main } from "@/components/Main";
import { contact } from "@/modules/contact";
import { loadMeta } from "@kenstack/admin/pageEditor";
import ModuleSettingsControl from "@kenstack/admin/moduleSettings/Control";

import { ContactForm } from "@/modules/contact/components/Form";

const slug = "contact";
const defaultValues = {
  title: "Contact",
  content: "",
};

export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function ContactPage() {
  return (
    <>
      <Main
        slug={slug}
        defaultValues={defaultValues}
        className="mx-auto mt-14 max-w-3xl px-4 text-center [&_.markdown]:text-justify [&_h1]:text-center"
      />
      <div className="mx-auto mt-4 flex max-w-3xl justify-center px-4">
        <ModuleSettingsControl module={contact} title="Contact Form Settings">
          <ContactForm />
        </ModuleSettingsControl>
      </div>
    </>
  );
}

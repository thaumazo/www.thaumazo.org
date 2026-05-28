import { Main, Container } from "@/components";
import Form from "@kenstack/auth/components/ResetPassword";

import { loadMeta } from "@kenstack/admin/pageEditor";
const slug = "reset-password";
const defaultValues = {
  title: "Reset Your Password",
};
export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <Container>
      <Main
        slug={slug}
        defaultValues={defaultValues}
        className="mx-auto mt-10 w-full max-w-3xl px-4 text-center [&_.markdown]:text-left [&_h1]:text-center"
      />
      <div className="mx-auto mt-4 flex w-full max-w-3xl justify-center px-4 [&_form]:w-full">
        <Form searchParams={searchParams} />
      </div>
    </Container>
  );
}

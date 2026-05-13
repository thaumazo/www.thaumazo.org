import { Main, Container } from "@/components";
import Form from "@kenstack/auth/components/ForgotPassword";

import { loadMeta } from "@kenstack/pageEditor";
const slug = "forgot-password";
const defaultValues = {
  title: "Forgot Your Password?",
};
export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default function page() {
  return (
    <Container>
      <Main
        slug={slug}
        defaultValues={defaultValues}
        className="mx-auto mt-10 w-full max-w-3xl px-4 text-center [&_.markdown]:text-left [&_h1]:text-center"
      />
      <div className="mx-auto mt-4 flex w-full max-w-3xl justify-center px-4 [&_form]:w-full">
        <Form />
      </div>
    </Container>
  );
}

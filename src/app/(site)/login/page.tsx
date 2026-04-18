// import { loadMeta, loadMD } from "@kenstack/lib/markdown";

import { Main, Container } from '@/components';
import CookieTest from '@kenstack/components/CookieTest';

// import SocialLogin from "@/components/login/Social";
import LoginForm from '@kenstack/auth/components/Login';
// import Link from "next/link";
// import { cacheLife, cacheTag } from "next/cache";

import { loadMeta, PageEditor } from '@kenstack/pageEditor';
const slug = 'login';
const defaultValues = {
  title: 'Login',
};
export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function page() {
  return (
    <Container>
      <Main slug={slug} defaultValues={defaultValues} />
      <CookieTest />
      <div className="mt-4 flex flex-col gap-8 md:flex-row md:gap-16">
        {/* <div className=" flex flex-col gap-4 md:max-w-96">
          <h3 className="text-xl">With a Sign-In Partner</h3>
          <SocialLogin />
          <div>
            By connecting via sign-in partner, you agree to our
            <Link target="_blank" href="/terms-and-conditions">
              Terms of Service
            </Link>
            .
          </div>
        </div> */}
        <div className="flex max-w-lg flex-col gap-4">
          {/* <h3 className="text-xl">By Email</h3> */}
          <LoginForm />
        </div>
      </div>
    </Container>
  );
}

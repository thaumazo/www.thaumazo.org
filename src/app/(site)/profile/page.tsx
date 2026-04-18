import Main from "@shared/components/Main";
import Suspense from "@kenstack/components/Suspense";
import { loadMeta, PageEditor } from "@kenstack/pageEditor";

import ProfileForm from "@tenants/modules/profile/Form";

type Params = { params: Promise<{ tenant: string }> };

const slug = "profile";
const defaultValues = {
  title: "Profile",
};

export const generateMetadata = async ({ params }: Params) => {
  const { tenant } = await params;
  return await loadMeta(slug, { tenant, defaultValues });
};

export default async function page({ params }: Params) {
  const { tenant } = await params;
  return (
    <PageEditor slug={slug} tenant={tenant} defaultValues={defaultValues}>
      <div className="m-4 flex flex-col gap-4">
        <Main className="max-w-lg" />
        <div className="max-w-xl">
          <Suspense>
            <ProfileForm />
          </Suspense>
        </div>
      </div>
    </PageEditor>
  );
}

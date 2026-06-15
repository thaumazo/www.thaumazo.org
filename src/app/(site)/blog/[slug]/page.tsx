import * as z from "zod";

import { BlogPostPage } from "@/modules/blog/components/Page";
import { pageRoute } from "@kenstack/pageRoute";

export { loadBlogPageMetadata as generateMetadata } from "@/modules/blog/queries";

export default pageRoute(
  {
    params: z.object({
      slug: z.string(),
    }),
    search: z.object({
      tag: z.string().trim().optional().catch(undefined),
    }),
  },
  ({ params, search }) => (
    <BlogPostPage slug={params.slug} tag={search.tag} />
  ),
);

import { createMetadataLoader } from "@kenstack/admin/queries";
import { loadBlogPage } from "./page";

export { loadBlogList } from "./list";
export { loadBlogTags } from "./tags";

export { loadBlogPage };
export const loadBlogPageMetadata = createMetadataLoader(loadBlogPage);

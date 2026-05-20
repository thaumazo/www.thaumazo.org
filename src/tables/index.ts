export * from "@/modules/users/tables";
export * from "@kenstack/db/tables";
import { blogTables } from "@/modules/blog/tables";

export * from "@/modules/organizations/tables";
export * from "@/modules/projects/tables";
export * from "@/modules/services/tables";

import { createContent } from "@kenstack/db/tables/content";
const content = createContent();
export { content };

export const blog = blogTables.posts;
export const blog_tags = blogTables.tags;
export const blog_images = blogTables.images;

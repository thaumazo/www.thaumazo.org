import { createBlogModule } from "@kenstack/modules/blog";
import { blogTables } from "./tables";

export const blog = createBlogModule({ tables: blogTables });

import * as z from "zod";

const pageSchema = z.object({
  title: z.string(),
  meta_title: z.string().optional(),
  description: z.string().optional(),
  draft: z.boolean().optional(),
  image: z.string().optional(),

  content: z.string().optional(),
});

type PageSchema = z.infer<typeof pageSchema>;
export { pageSchema, type PageSchema };

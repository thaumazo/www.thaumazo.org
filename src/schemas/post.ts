import { pageSchema } from "./page";
import * as z from "zod";

const postSchema = pageSchema.extend({
  date: z.date().nullish().or(z.literal("")),
  start_date: z.date().nullish().or(z.literal("")),
  end_date: z.date().nullish().or(z.literal("")),
  author: z.string().nullish(),
  email: z.string().nullish(),
  url: z.url().nullish().or(z.literal("")),
  linkedin: z.url().nullish().or(z.literal("")),
  categories: z.array(z.string()).nullish(),
  tags: z.array(z.string()).nullish(),
  roles: z.array(z.string()).nullish(),
  communities: z.array(z.string()).nullish(),
  partners: z.array(z.string()).nullish(),
  liaison: z.array(z.string()).nullish(),
  status: z.array(z.string()).nullish(),
  projects: z.array(z.string()).nullish(),
  sdgs: z
    .array(
      z.enum(
        [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
        ],
        { message: "SDG's must be a string ranging from 1 to 17" }
      )
    )
    .nullish(),
  location: z.string().nullish(),
});

type PostSchema = z.infer<typeof postSchema>;
export { postSchema, type PostSchema };

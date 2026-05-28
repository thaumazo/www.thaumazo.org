import * as z from "zod";
import { email } from "@kenstack/zod/email";

export const schema = z.object({
  givenName: z.string().min(1, "Given Name is required"),
  familyName: z.string().min(1, "Family Name is required"),
  email,
  organization: z.string(),
  message: z.string().min(1, "Please fill out this field"),
});

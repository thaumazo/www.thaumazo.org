import * as z from "zod";
import { email } from "@kenstack/schemas/atoms";

const schema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: email(),
  organization: z.string(),
  message: z.string().min(1, "Please fill out this field"),
});

export default schema;

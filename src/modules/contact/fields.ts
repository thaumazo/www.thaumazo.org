import { defineFields } from "@kenstack/fields";
import { emailField, textField } from "@kenstack/fields/client";
import * as z from "zod";

export const settingsFields = defineFields({
  to: emailField(),
  subject: textField({
    default: "Contact form submission",
    zod: z.string().trim().min(1, "Subject is required"),
  }),
});

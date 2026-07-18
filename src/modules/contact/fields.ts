import { defineFields } from "@kenstack/admin/fields";
import { emailField, textField } from "@kenstack/fields/client";
import * as z from "zod";

export const settingsFields = defineFields({
  fields: {
    to: emailField(),
    subject: textField({
      default: "Contact form submission",
      zod: z.string().trim().min(1, "Subject is required"),
    }),
  },
});

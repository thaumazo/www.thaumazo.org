"use server";

import checkServerValidity from "@thaumazo/forms/validity/checkServerValidity";
import fields from "./fields";

export default async function formAction(state, formData) {

  const fieldErrors = checkServerValidity(fields, formData);
  if (fieldErrors) {
    return {
      error:
        "We couldn't process your request. See the errors marked in red below.",
      fieldErrors,
    };
  }

  return { success: "Thank you for reaching out. We look forward to reviewing your submission." };

}

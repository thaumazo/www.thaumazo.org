"use server";

import checkServerValidity from "@kenstack/forms/validity/checkServerValidity";
import fields from "./fields";

import Email from "@kenstack/forms/Email";
import { render } from "@react-email/render";
import mailer from "@kenstack/utils/mailer";

export default async function formAction(state, formData) {
  const fieldErrors = checkServerValidity(fields, formData);
  if (fieldErrors) {
    return {
      error:
        "We couldn't process your request. See the errors marked in red below.",
      fieldErrors,
    };
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return { error: "Setup error. CONTACT_EMAIL is not defined" };
  }

  const html = await render(<Email fields={fields} formData={formData} />, {
    pretty: true,
  });

  try {
    await mailer({
      to: [to],
      from: "do.not.reply@thaumazo.org",
      subject: "Contact form submission",
      html,
    });
  } catch (e) {
    console.error("Error sending email", e);
    return {
      error:
        "There was an unexpected problem handling your request. Please try again later.",
    };
  }

  return {
    success:
      "Thank you for reaching out. We look forward to reviewing your submission.",
  };
}

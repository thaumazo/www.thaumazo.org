import { apiPipeline, recaptcha, validate } from "@kenstack/api";

import form from "../fields";

import Email from "@kenstack/forms/AutoEmail";
import { render } from "@react-email/render";
import mailer from "@kenstack/utils/mailer";

export const POST = (...args) =>
  apiPipeline(...args, [validate(), recaptcha(), formAction], { form });

async function formAction({ json: values }) {
  const fields = form.getFields();
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return Response.json({
      error: "Setup error. CONTACT_EMAIL is not defined",
    });
  }

  const html = await render(<Email fields={fields} values={values} />, {
    pretty: true,
  });

  try {
    await mailer({
      to: [to],
      // from: "do.not.reply@giveround.com",
      from: "do.not.reply@thaumazo.org",
      subject: "Contact form submission",
      html,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Error sending email", e);
    return Response.json({
      error:
        "There was an unexpected problem handling your request. Please try again later.",
    });
  }

  return Response.json({
    success:
      "Thank you for reaching out. We look forward to reviewing your submission.",
  });
}

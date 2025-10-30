import contactMailer from "@/modules/contact/api/mailer";
import Email, { attachments } from "@/email/Email";

export const POST = contactMailer({
  Email: Email,
  attachments,
  from: "Thaumazo Contact Mailer <unmonitored@thaumazo.org>",
});

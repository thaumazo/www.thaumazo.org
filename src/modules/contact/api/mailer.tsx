import { type Geo, geolocation } from "@vercel/functions";
import { pipeline, recaptcha, type PipelineAction } from "@kenstack/lib/api";
import schema from "../schema";
import mailer, { type Attachment } from "@kenstack/lib/mailer";
import { render } from "@react-email/render";
import startCase from "lodash-es/startCase";

import { waitUntil } from "@vercel/functions";
import * as z from "zod";

import type { NextRequest } from "next/server";

type ContactMailerProps = {
  Email: React.FC<{ preview?: boolean; children: React.ReactNode }>; //<ForgottenPasswordEmailProps>;
  attachments: Attachment[];
  from: string;
};

const contactMailerPost =
  (props: ContactMailerProps) => (request: NextRequest) =>
    pipeline(request, schema, [recaptcha(), contactMailerAction(props)]);

const contactMailerAction =
  (props): PipelineAction<typeof schema> =>
  async ({ data, request, response }) => {
    const geo = geolocation(request);
    waitUntil(messageMailer(props, data, geo));

    return response.success({
      message:
        "Thank you for reaching out. We look forward to reviewing your submission.",
    });
  };

const messageMailer = async (
  { Email, attachments, from }: ContactMailerProps,
  data: z.infer<typeof schema>,
  geo: Geo
) => {
  const html = await render(
    <Email>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <h3>{startCase(key)}:</h3>
          <pre>{String(value)}</pre>
          <br />
        </div>
      ))}
      <h3>Geolocation</h3>
      <table border={1} cellPadding={5} cellSpacing={0}>
        {Object.entries(geo).map(([key, value]) => (
          <tr key={key} style={{}}>
            <th align="left" style={{}}>
              {startCase(key)}:
            </th>
            <td align="left">{value}</td>
          </tr>
        ))}
      </table>
    </Email>
  );

  await mailer({
    to: process.env.CONTACT_EMAIL,
    from,
    subject: "Contact form submission",
    html,
    attachments,
  });
};
export default contactMailerPost;

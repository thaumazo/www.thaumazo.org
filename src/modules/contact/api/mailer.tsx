import { type Geo, geolocation } from "@vercel/functions";
import { pipeline, pipelineStage, recaptcha } from "@kenstack/api";
import { deps } from "@app/deps";
import { schema } from "../schema";
import mailer, { type Attachment } from "@kenstack/lib/mailer";
import { loadContactSettings } from "./queries";
import { render } from "@react-email/render";
import startCase from "lodash-es/startCase";

import * as z from "zod";

import type { NextRequest } from "next/server";

type ContactMailerProps = {
  Email?: React.FC<{ preview?: boolean; children: React.ReactNode }>;
  attachments?: Attachment[];
  from?: typeof deps.email.from;
};

export const contactMailerPost =
  (props: ContactMailerProps = {}) =>
  (request: NextRequest) =>
    pipeline({ request }, [recaptcha(), contactMailerAction(props)]);

const contactMailerAction = (props: ContactMailerProps) =>
  pipelineStage({ schema }, async ({ data, request, response }) => {
    const from = props.from ?? deps.email.from;

    if (!from) {
      return response.error(
        "Email sender is not configured. Set deps.email.from, or FROM_ADDRESS.",
      );
    }

    const settings = await loadContactSettings();
    const geo = geolocation(request);
    await messageMailer(
      {
        ...props,
        from,
        subject: settings.subject,
        to: settings.to,
      },
      data,
      geo,
    );

    return response.success({
      message:
        "Thank you for reaching out. We look forward to reviewing your submission.",
    });
  });

const messageMailer = async (
  {
    Email = deps.email.EmailCont,
    attachments = deps.email.attachments,
    from,
    subject,
    to,
  }: Omit<ContactMailerProps, "from"> & {
    from: NonNullable<ContactMailerProps["from"]>;
    subject: string;
    to: string;
  },
  data: z.infer<typeof schema>,
  geo: Geo,
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
    </Email>,
  );

  const result = await mailer({
    to,
    from,
    subject,
    html,
    attachments,
  });

  if (!result) {
    throw new Error("Contact form email could not be sent.");
  }
};

import { Section, Text } from "@react-email/components";

import getOrigin from "@kenstack/lib/getOrigin";
import Markdown from "@kenstack/components/Markdown";

import EmailCont from "@server/email";
export { attachments } from "@server/email";

export default async function WelcomeEmail({ preview = false, name = "" }) {
  const origin = await getOrigin();
  const md = `
Welcome to GiveRound! Whether you've signed up to simplify how your business handles donation requests, or to build a more intentional community giving strategy, we are so glad you're here.

GiveRound helps you:

- Set clear giving guidelines
- Share a simple QR code with in-person askers (Seekers)
- Receive and respond to aligned requests on your own terms

It’s an easy way to stay organized, reduce pressure, and focus your giving on causes that reflect your values and will contribute to how your community sees your business.

We have some helpful resources for you in our [Learning Centre](${origin}/learning-centre). If you need help getting started, just reply to this email - we’re always happy to help.

Thanks for being part of the GiveRound community.

The GiveRound Team
    
  `;

  return (
    <EmailCont preview={preview}>
      <Section style={{ paddingBottom: "40px" }}>
        <Text
          style={{
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          Hi {name},
        </Text>
        <Markdown content={md} />

        <Text>Next Step:</Text>

        <Text style={{ textAlign: "center" }}>
          <Button href={origin + "/members/organizations/new"}>
            Setup your Organization
          </Button>
        </Text>
        {/*}
        <Text style={{ textAlign: "center" }}>
          <Button
            style={{ backgroundColor: "#c70036" }}
            href={origin + "/profile"}
          >
            Update your Profile
          </Button>
        </Text>
      */}
      </Section>
    </EmailCont>
  );
}

import { Button as ButtonOG } from "@react-email/components";

function Button({
  style = {},
  children,
  ...props
}: React.ComponentProps<typeof ButtonOG>) {
  return (
    <ButtonOG
      style={{
        backgroundColor: "#1a82e2",
        color: "#ffffff",
        textDecoration: "none",
        borderRadius: "4px",
        padding: "12px 24px",
        display: "inline-block",
        fontSize: "16px",
        ...style,
      }}
      // href={domain + "/members/organizations/new"}
      {...props}
    >
      {children}
    </ButtonOG>
  );
}

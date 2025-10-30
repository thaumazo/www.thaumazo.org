import { Fragment } from "react";
import {
  Html,
  Head,
  // Preview,
  Body,
  Container,
  Section,
  Img,
  Text,
  // Button as ButtonOG,
  Row,
  Column,
} from "@react-email/components";

const footerLinks = [
  {
    heading: "",
    links: [["Contact Us", "/contact"]],
  },
];

const domain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://thaumazo.org";

const logoBase64 =
  "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";

const EmailCont = ({
  children,
  preview = false,
}: {
  children: React.ReactNode;
  preview?: boolean;
}) => (
  <Html>
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    {/*
    <Preview style={{ fontSize: "16px"}}>Welcome! Click below to get started.</Preview>
    */}
    <Body
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#ffffff",
        fontFamily: "verdana, sans-serif",
      }}
    >
      {/* Main container */}
      <Container
        style={{
          // width: "100%",
          // maxWidth: "600px",
          // margin: "0 auto",
          // padding: "20px",
          border: "1px solid #eaeaea",
          borderRadius: "4px",
          margin: "40px auto auto",
          padding: "20px",
          width: "465px",
        }}
      >
        <Section style={{ textAlign: "center", paddingBottom: "30px" }}>
          <a
            href={domain + "/"}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            <Img
              src={
                preview ? "data:image/png;base64," + logoBase64 : "cid:logo@cid"
              }
              alt="GiveRound Logo"
              width={98}
              height={98}
              style={{ display: "block", margin: "0 auto" }}
            />
          </a>
        </Section>
        {children}
      </Container>

      {/* Footer with 2 columns of links */}
      <Section
        style={{
          color: "#ffffff",
          backgroundColor: "#c70036",
          padding: "20px 0",
        }}
      >
        <Container
          style={{
            // width: "100%",
            width: "465px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {footerLinks.map(({ heading, links }, i) => {
            const Parent = i % 2 === 0 ? Row : Fragment;
            return (
              <Parent key={i}>
                <Column
                  style={{
                    verticalAlign: "top",
                    width: "50%",
                    padding: "0 10px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "14px",
                      textAlign: "center",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      color: "#ffffff",
                    }}
                  >
                    {heading}
                  </Text>
                  {links.map(([title, href], j) => (
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                        margin: "4px 0",
                      }}
                      key={i + "-" + j}
                    >
                      <a
                        href={domain + href}
                        style={{
                          color: "#fff",
                          // textDecoration: "none",
                        }}
                      >
                        {title}
                      </a>
                    </Text>
                  ))}
                </Column>
              </Parent>
            );
          })}
        </Container>
      </Section>
    </Body>
  </Html>
);

export const attachments = [
  {
    inline: true,
    filename: "logo.png",
    contentType: "image/png",
    data: logoBase64,
    headers: { "Content-ID": "logo@cid" }, // <— wrap in angle brackets when sent
  },
];

export default EmailCont;

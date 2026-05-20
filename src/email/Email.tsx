import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
} from "@react-email/components";
import logoBase64 from "./logo";

const footerLinks = [
  ["Community", "/community"],
  ["Projects", "/projects"],
  ["Services", "/services"],
  ["Contact", "/contact"],
] as const;

const domain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://thaumazo.org";

const logoContentId = "thaumazo-email-logo@thaumazo.org";

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
    <Body
      style={{
        margin: 0,
        padding: "32px 0",
        backgroundColor: "#f7f8f6",
        fontFamily: "Verdana, Arial, sans-serif",
      }}
    >
      <Container
        style={{
          border: "1px solid #e1e4df",
          borderRadius: "8px",
          margin: "0 auto",
          padding: "28px",
          width: "520px",
          backgroundColor: "#ffffff",
        }}
      >
        <Section style={{ paddingBottom: "26px", width: "100%" }}>
          <table
            role="presentation"
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            style={{ width: "100%" }}
          >
            <tbody>
              <tr>
                <td align="center">
                  <a
                    href={domain + "/"}
                    style={{
                      display: "inline-block",
                      textDecoration: "none",
                    }}
                  >
                    <Img
                      src={
                        preview
                          ? "data:image/png;base64," + logoBase64
                          : `cid:${logoContentId}`
                      }
                      alt="Thaumazo"
                      width={93}
                      height={24}
                      style={{
                        border: 0,
                        display: "block",
                        height: "24px",
                        margin: "0 auto",
                        outline: "none",
                        width: "93px",
                      }}
                    />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
        {children}
      </Container>

      <Container
        style={{
          margin: "18px auto 0",
          width: "520px",
        }}
      >
        <Text
          style={{
            color: "#5e685d",
            fontSize: "12px",
            lineHeight: "20px",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          Thaumazo
        </Text>
        <Text
          style={{
            color: "#5e685d",
            fontSize: "12px",
            lineHeight: "20px",
            margin: "0",
            textAlign: "center",
          }}
        >
          {footerLinks.map(([title, href], index) => (
            <span key={href}>
              {index > 0 ? "  |  " : ""}
              <a
                href={domain + href}
                style={{ color: "#365a3d", textDecoration: "underline" }}
              >
                {title}
              </a>
            </span>
          ))}
        </Text>
      </Container>
    </Body>
  </Html>
);

export const attachments = [
  {
    inline: true,
    filename: "thaumazo-email-logo-93x24.png",
    contentType: "image/png",
    data: logoBase64,
    headers: { "Content-ID": logoContentId },
  },
];

export default EmailCont;

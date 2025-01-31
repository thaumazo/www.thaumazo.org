import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function ForgottenPasswordEmail({
  name = "Your name",
  url = null,
  admin = false, // sent by administrator
  message = `
We received a request to reset the password for your account\
associated with this email address. If you are expecting this request,\
please click on the link below to reset your password:\
`,
  postMessage = "This link will remain active for 15 minutes.",

  country = null,
  city = null,
  region = null,
  ip = null,
}) {
  let location = city;

  if (region) {
    location += (location ? ", " : "") + region;
  }

  if (country) {
    location += (location ? " " : "") + country;
  }

  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#ffffff",
          margin: "auto",
          fontFamily: "sans-serif",
        }}
      >
        <Container
          style={{
            border: "1px solid #eaeaea",
            borderRadius: "4px",
            margin: "40px auto",
            padding: "20px",
            width: "465px",
          }}
        >
          <Heading
            style={{
              color: "#000000",
              fontSize: "24px",
              fontWeight: "normal",
              textAlign: "center",
              padding: "0",
              margin: "30px 0",
            }}
          >
            Reset your password
          </Heading>
          <Text
            style={{ color: "#000000", fontSize: "14px", lineHeight: "24px" }}
          >
            Hello {name},
          </Text>
          <Text
            style={{
              whiteSpace: "pre-wrap",
              color: "#000000",
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            {message}
          </Text>
          <Section
            style={{
              textAlign: "center",
              marginTop: "32px",
              marginBottom: "32px",
            }}
          >
            <Button
              style={{
                padding: "10px 20px",
                backgroundColor: "#1D4ED8",
                borderRadius: "4px",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "bold",
                textDecoration: "none",
                textAlign: "center",
              }}
              href={url}
            >
              Reset your password
            </Button>
          </Section>
          <Text
            style={{
              whiteSpace: "pre-wrap",
              color: "#000000",
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            {postMessage}
          </Text>
          {admin ? null : (
            <>
              <Hr
                style={{
                  border: "1px solid #eaeaea",
                  margin: "26px 0",
                  width: "100%",
                }}
              />
              <Text
                style={{
                  color: "#666666",
                  fontSize: "12px",
                  lineHeight: "24px",
                }}
              >
                This email was intended for{" "}
                <span style={{ color: "#000000" }}>{name} </span>. It was
                requested from <span style={{ color: "#000000" }}>{ip}</span>
                {location && (
                  <>
                    located in{" "}
                    <span style={{ color: "#000000" }}>{location}</span>
                  </>
                )}
                . If you were not expecting this email, you can ignore it. If
                you are concerned about your account{"'"}s safety, please reply
                to this email to get in touch with us.
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

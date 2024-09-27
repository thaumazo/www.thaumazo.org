import { NextResponse } from "next/server";

const rules = `

User-agent: *
Allow: /

# Host
Host: https://www.thaumazo.org

`;

export async function GET() {
  const robotsTxt =
    process.env.VERCEL_ENV === "preview" ? "User-agent: *\nDisallow: /" : rules;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

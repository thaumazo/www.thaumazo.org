import { NextResponse } from "next/server";
import { session } from "@/config/server";

export async function GET() {
  let user;
  try {
    user = await session.getAuthenticatedUser();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({
      authenticated: false,
    });
  }

  if (!user) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  return NextResponse.json({
    authenticated: true,
    email: user.email,
    roles: user.roles,
  });
}

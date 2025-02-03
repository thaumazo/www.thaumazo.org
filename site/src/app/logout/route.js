import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { session } from "@/config/server";

async function GET(request) {
  await session.logout();

  const url = request.nextUrl.protocol + request.headers.get("host");
  const r = NextResponse.redirect(new URL("/?logout=" + Date.now(), url));
  r.cookies.set("logout", Date.now());

  revalidatePath("/");
  return r;
}

export { GET };

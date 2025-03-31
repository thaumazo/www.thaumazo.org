import { NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";

import { session } from "@/config/server";

export async function GET(request) {
  await session.logout();
  return new NextResponse("OK");

  // const url = request.nextUrl.protocol + request.headers.get("host");
  // const r = NextResponse.redirect(new URL("/?logout=" + Date.now(), url));
  // r.cookies.set("logout", Date.now());

  // revalidatePath("/");
  // return r;
}

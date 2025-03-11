import AccountMenu from "@kenstack/components/AccountMenu";
import { session } from "@/config/server";

import Contents from "./Contents";

export default async function DropmenuServer() {
  // const claims = await session.getClaims();

  // if (claims === false) {
  //   return <Link href="/login">Log in</Link>
  // }

  // const roles = claims.roles;
  return (
    <AccountMenu
      session={session}
      buttonClass="btn btn-outline-primary btn-sm hidden lg:inline-block"
    >
      <Contents />
    </AccountMenu>
  );
}

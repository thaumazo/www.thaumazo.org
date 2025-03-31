import Item from "@kenstack/components/AccountMenu/Item";

import CogIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import LogoutIcon from "@kenstack/icons/Logout";
import PasswordIcon from "@kenstack/icons/Password";
import AccountCircleIcon from "@kenstack/icons/AccountCircle";

import { session } from "@/config/server";
// import { headers } from "next/headers";

export default async function MenuContents() {
  // const user = await session.getAuthenticatedUser();
  const isAdmin = await session.hasRole("ADMIN");

  return (
    <nav className="flex flex-col divide-y divide-gray-300" role="none">
      {isAdmin && <Item href="/admin" Icon={CogIcon} text="Site admin" />}
      <Item href="/password" Icon={AccountCircleIcon} text="Profile" />
      <Item href="/reset-password" Icon={PasswordIcon} text="Change password" />
      <Item href="/logout" Icon={LogoutIcon} text="Sign out" prefetch={false} />
    </nav>
  );
}

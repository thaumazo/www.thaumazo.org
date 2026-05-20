import type { ReactNode } from "react";
import AccountMenu from "@kenstack/components/AccountMenu";
import type { AccountMenuItemsResolver } from "@kenstack/components/AccountMenu";
import { LayoutDashboard, RectangleEllipsis /*UserPen*/ } from "lucide-react";

const getAccountMenuItems: AccountMenuItemsResolver = (user) => [
  ...(user.roles.includes("admin")
    ? [["/admin/users", "Admin", LayoutDashboard] as const]
    : []),
  // ["/profile", "Profile", UserPen],
  ["/reset-password", "Reset Password", RectangleEllipsis],
];

export default function SiteAccountMenu({
  fallback,
}: {
  fallback: ReactNode;
}) {
  return <AccountMenu items={getAccountMenuItems} fallback={fallback} />;
}

import { createDeps } from "@kenstack/deps";

import * as tables from "@/tables";

import { LayoutDashboard, RectangleEllipsis, UserPen } from "lucide-react";

export const deps = createDeps({
  tables,
  accountMenu: {
    getItems: () => [
      ["/admin/users", "Admin", LayoutDashboard],
      ["/profile", "Profile", UserPen],
      ["/reset-password", "Reset Password", RectangleEllipsis],
    ],
  },
});

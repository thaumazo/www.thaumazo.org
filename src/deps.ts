import { createDeps } from "@kenstack/deps";

import * as tables from "@/tables";

import { RectangleEllipsis, UserPen } from "lucide-react";

export const deps = createDeps({
  tables,
  accountMenu: {
    getItems: () => [
      ["/profile", "Profile", UserPen],
      ["/reset-password", "Reset Password", RectangleEllipsis],
    ],
  },
});

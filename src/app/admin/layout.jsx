import "@kenstack/styles/admin.scss";

import Sidebar from "@/components//Sidebar";

export default function layout({ children }) {
  return <Sidebar>{children}</Sidebar>;
}

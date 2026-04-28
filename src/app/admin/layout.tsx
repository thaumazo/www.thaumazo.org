import Sidebar from "@kenstack/admin/Sidebar";
import adminConfig from "@/modules/admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar adminConfig={adminConfig} content={<h1>foob ar</h1>}>
      {children}
    </Sidebar>
  );
}

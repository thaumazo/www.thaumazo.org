import Sidebar from "@kenstack/admin/Sidebar";
import admin from "@/modules/admin";
import Logo from "@/components/Logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar
      logo={<Logo className="block h-8 w-auto" />}
      admin={admin}
      content={<h1>foob ar</h1>}
    >
      {children}
    </Sidebar>
  );
}

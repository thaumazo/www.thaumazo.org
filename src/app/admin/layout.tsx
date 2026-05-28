import Sidebar from "@kenstack/admin/Sidebar";
import QueryProvider from "@kenstack/context/QueryProvider";
import admin from "@/modules/admin";
import AccountMenu from "@/components/AccountMenu";
import Logo from "@kenstack/admin/Sidebar/KenstackLogo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <Sidebar
        logo={<Logo className="block h-8 w-auto" />}
        admin={admin}
        accountMenu={<AccountMenu fallback={null} />}
      >
        {children}
      </Sidebar>
    </QueryProvider>
  );
}

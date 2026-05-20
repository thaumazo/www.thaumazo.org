import Sidebar from "@kenstack/admin/Sidebar";
import admin from "@/modules/admin";
import AccountMenu from "@/components/AccountMenu";
import Logo from "@/components/Logo";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar
      logo={<Logo className="block h-8 w-auto" />}
      admin={admin}
      accountMenu={<AccountMenu fallback={null} />}
    >
      {children}
    </Sidebar>
  );
}

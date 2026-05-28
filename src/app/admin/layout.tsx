import Sidebar from "@kenstack/admin/Sidebar";
import QueryProvider from "@kenstack/context/QueryProvider";
import admin from "@/modules/admin";
import AccountMenu from "@/components/AccountMenu";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <Sidebar
        logo={
          <Image
            src="/images/logo/thaumazo-symbol-beside.svg"
            alt="Thaumazo"
            width={1343}
            height={347}
            className="block h-8 w-auto"
            priority
          />
        }
        admin={admin}
        accountMenu={<AccountMenu fallback={null} />}
      >
        {children}
      </Sidebar>
    </QueryProvider>
  );
}

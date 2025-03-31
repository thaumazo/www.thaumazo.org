import { SidebarProvider /*, SidebarTrigger*/ } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function AdminSidebar({ children }) {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />
      <main className="flex-1">
        {/* <SidebarTrigger /> */}
        <div className="px-2 py-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}

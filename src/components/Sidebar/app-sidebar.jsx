// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import Link from "next/link";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
// const items = [
//   {
//     title: "Home",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Inbox",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ]

import { adminConfig } from "@/config/client";

const items = [...adminConfig.getLinks()];

export async function AppSidebar() {
  return (
    <Sidebar className="">
      <SidebarHeader className="bg-gray-200  border-b">
        <Link href="/">
          <img src="/images/logo.svg" alt="logo" className="max-w-32" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(([href, title, Icon]) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <a href={href}>
                      <Icon />
                      <span>{title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

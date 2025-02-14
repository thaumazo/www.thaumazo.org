"use client";

import Sidebar from "@/components/Sidebar";

// import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
// import ProjectsIcon from "@/icons/Projects";
// import GlobeIcon from "@heroicons/react/24/outline/GlobeAmericasIcon";

import { adminConfig } from "@/config/client";

const sidebarLinks = [
  // ["/admin", "Manage users", UsersIcon],
  // ["/admin/projects", "Projects", ProjectsIcon],
  // ["/admin/organizations", "Organizations", GlobeIcon],
  ...adminConfig.getLinks(),
];





export default function AdminSidebar() {
return <Sidebar links={sidebarLinks} />;
}

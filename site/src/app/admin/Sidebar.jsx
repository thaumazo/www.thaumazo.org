"use client";

import Sidebar from "@/components/Sidebar";

// import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import GlobeIcon from "@heroicons/react/24/outline/GlobeAmericasIcon";

const sidebarLinks = [
  // ["/admin", "Dashboard", ChartBarIcon],
  ["/admin", "Manage users", UsersIcon],
  // ["/admin/sites", "Sites", GlobeIcon],
];

export default function AdminSidebar() {
  return <Sidebar links={sidebarLinks} />;
}

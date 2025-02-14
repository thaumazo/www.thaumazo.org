import AdminConfig from "@kenstack/modules/Admin/Config";

export const adminConfig = new AdminConfig([
  ['User', () => import('./models/User'), {
    icon: () => import('@heroicons/react/24/outline/UsersIcon'),
    title: "Manage users",
    path: null,
  }],
  ['Project', () => import('./models/Project'), {
    icon: () => import('@/icons/Projects'),
  }],
  ['Organization', () => import('./models/Project'), {
    icon: () => import('@heroicons/react/24/outline/GlobeAmericasIcon'),
  }],
]);

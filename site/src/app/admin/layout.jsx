import "@kenstack/styles/admin.scss";

// import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import Sidebar from "./Sidebar";

export default function layout({ children }) {
  return (
    <div className="light">
      <div className="flex space-x-2">
        <div className="w-1/4 max-w-48">
          <Sidebar />
        </div>
        <div className="flex-1">
          {children}
          {/*<AppRouterCacheProvider>{children}</AppRouterCacheProvider>*/}
        </div>
      </div>
    </div>
  );
}

"use client";

// import config from "@/config/config.json";
// import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import QueryProvider from "@kenstack/query/QueryProvider";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import { UserInfoProvider } from "@/context/userInfo";

const Providers = ({ children }: { children: ReactNode }) => {
  // const { default_theme } = config.settings;

  return (
    <RecaptchaProvider>
      <QueryProvider>
        <UserInfoProvider>{children}</UserInfoProvider>
      </QueryProvider>
    </RecaptchaProvider>
  );
};

export default Providers;

// <ThemeProvider
//   attribute="class"
//   defaultTheme={default_theme}
//   enableColorScheme={false}
// >

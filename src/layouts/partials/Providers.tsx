"use client";

import config from "@/config/config.json";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import QueryProvider from "@kenstack/query/QueryProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  const { default_theme } = config.settings;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={default_theme}
      enableColorScheme={false}
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
};

export default Providers;

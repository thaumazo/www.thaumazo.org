"use client";

import QueryProvider from "@kenstack/context/QueryProvider";

export default function Providers({ children }) {
  return <QueryProvider>{children}</QueryProvider>;
}

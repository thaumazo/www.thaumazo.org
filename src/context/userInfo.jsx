"use client";

import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@kenstack/query";
import { usePathname } from "next/navigation";

const UserInfoContext = createContext({});

export function UserInfoProvider({ children }) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(true);
  }, []);

  const query = useQuery({
    queryKey: ["user-info"],
    queryFn: async () => {
      const res = await fetch("/api/user-info", {
        method: "GET",
        cache: "no-store",
      });

      if (res.ok) {
        return await res.json();
      }
      return { authenticated: false };
    },
    enabled,
    // refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    // staleTime: Infinity,
    refetchInterval: 300000, // re-fetch every 5 minutes
  });

  const { refetch, isLoading } = query;
  let context = query;

  // ensure query is run when switching pages
  useEffect(() => {
    if (isLoading === false) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (enabled === false) {
    context = { isLoading: true }; // fix hydration error
  }

  return (
    <UserInfoContext.Provider value={context}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserInfoContext);
  return context;
}

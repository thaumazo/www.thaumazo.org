import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const mobileQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

export function useIsMobile() {
  return React.useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(mobileQuery);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(mobileQuery).matches,
    () => false
  );
}

import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { NavConfig } from "@features/layout/nav-config";

export function useNav(navConfig: NavConfig) {
  const location = useLocation();

  const keys = useMemo(() => {
    for (const topNav of navConfig) {
      for (const side of topNav.sidenavs || []) {
        for (const child of side.children || []) {
          if (child.key === location.pathname) {
            return {
              activeTopNav: topNav.key,
              activeSideNav: side.key,
              openSideKeys: [side.key],
            };
          }
        }
      }
    }
    return {
      activeTopNav: '',
      activeSideNav: '',
      openSideKeys: [],
    };
  }, [location.pathname, navConfig]);

  return keys;
}

import { useEffect } from "react";
import appService from "@services/app.service";

export function useNav(topnav: string, sidenav: string, opensidenav?: string[]) {
  useEffect(() => {
    appService.setNav(topnav, sidenav, opensidenav);
  }, [sidenav, topnav, opensidenav]);
}

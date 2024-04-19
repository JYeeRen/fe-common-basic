import { Outlet } from "react-router-dom";
import { AntConfigProvider, App as AntApp } from "@components";

function Root() {
  return (
    <AntConfigProvider>
      <AntApp>
        <Outlet />
      </AntApp>
    </AntConfigProvider>
  );
}

export default Root;

import { Outlet } from "react-router-dom";
import { AntConfigProvider, App as AntApp } from "@components";
import { ErrorBoundary } from "@infra";

function Root() {
  return (
    <AntConfigProvider>
      <AntApp style={{ width: "100%", height: "100%" }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </AntApp>
    </AntConfigProvider>
  );
}

export default Root;

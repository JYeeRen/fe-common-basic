import { Outlet } from "react-router-dom";
import { AntConfigProvider, App as AntApp } from "@components";
import { ErrorBoundary } from "@infra";
import { ProtectedRoute } from './protected.route';

function Root() {
  return (
    <AntConfigProvider>
      <AntApp style={{ width: "100%", height: "100%" }}>
        <ErrorBoundary>
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        </ErrorBoundary>
      </AntApp>
    </AntConfigProvider>
  );
}

export default Root;

import { Outlet } from "react-router-dom";
import { AntConfigProvider, App as AntApp, Watermark } from "@components";
import { ErrorBoundary } from "@infra";
import { ProtectedRoute } from './protected.route';

const ENV = import.meta.env.VITE_ENV;

function Root() {
  return (
    <AntConfigProvider>
      <AntApp style={{ width: "100%", height: "100%" }}>
        <ErrorBoundary>
          <ProtectedRoute>
            <Watermark content={ENV} style={{ width: '100%', height: '100%' }} font={{ color: '#f0f0f0' }}>
            <Outlet />
            </Watermark>
          </ProtectedRoute>
        </ErrorBoundary>
      </AntApp>
    </AntConfigProvider>
  );
}

export default Root;

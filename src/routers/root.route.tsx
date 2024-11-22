import { Outlet } from "react-router-dom";
import { AntConfigProvider, App as AntApp, Watermark } from "@components";
import { ErrorBoundary } from "@infra";
import { ProtectedRoute } from "./protected.route";

const watermarkContent = import.meta.env.VITE_WATERMARK_CONTENT;
const ENV = import.meta.env.VITE_ENV;

function Root() {
  return (
    <AntConfigProvider>
      <AntApp style={{ width: "100%", height: "100%" }}>
        <Watermark
          content={`${watermarkContent}${ENV ?? ''}`}
          style={{ width: "100%", height: "100%" }}
          font={{ color: "#f0f0f0" }}
        >
          <ErrorBoundary>
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          </ErrorBoundary>
        </Watermark>
      </AntApp>
    </AntConfigProvider>
  );
}

export default Root;

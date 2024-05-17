import { RouterProvider } from "react-router-dom";
import { router } from "@routers";
import { useEffect } from "react";
import { debug } from "@infra";
import appService from "@services/app.service";

function App() {
  useEffect(() => {
    debug.infra('refresh permission');
    appService.refreshPermission();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;

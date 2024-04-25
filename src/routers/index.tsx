import { createBrowserRouter } from "react-router-dom";
import Root from "./root.route";
import { routesConfig } from "./config";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: routesConfig,
  },
]);

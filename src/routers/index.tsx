import { createHashRouter } from "react-router-dom";
import Root from "./root.route";
import { routesConfig } from "./config";

export const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: routesConfig,
  },
]);

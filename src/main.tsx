import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { init } from "./locale";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LoginRouter } from '@features/login/router'

import ErrorPage from '@features/error/error';
import Home from '@features/home/home';


init();

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'customs',
        children: [
          { path: 'basic-data', lazy: async () => ({ Component: (await import('@features/customs/basic-data')).default }) },
          { path: 'declareation', lazy: async () => ({ Component: (await import('@features/customs/declareation')).default }) },
          { path: 'risk-control', lazy: async () => ({ Component: (await import('@features/customs/risk-control')).default }) },
        ]
      },
      {
        path: 'data-template',
        children: [
          { path: 'maintenance', lazy: async () => ({ Component: (await import('@features/data-template/maintenance')).default }) },
          { path: 'add', lazy: async () => ({ Component: (await import('@features/data-template/addition')).default }) },
        ]
      },
      {
        path: 'trajectory',
        children: [
          { path: 'maintenance', lazy: async () => ({ Component: (await import('@features/trajectory/maintenance')).default }) },
        ]
      },
      LoginRouter
    ]
  },
  
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

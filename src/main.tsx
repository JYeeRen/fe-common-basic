import React from "react";
import ReactDOM from "react-dom/client";
import { init } from "./locale";
import {
  // createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { LoginRouter } from '@features/login/router'

import ErrorPage from '@features/error/error';
import Layout from '@features/layout/layout';

import "./index.css";

init();

const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        lazy: async () => ({ Component: (await import('@features/welcome/welcome')).default })
      },
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
      {
        path: 'management',
        children: [
          { path: 'account', lazy: async () => ({ Component: (await import('@features/management/account/list')).default }) },
          { path: 'roles', lazy: async () => ({ Component: (await import('@features/management/role/role-list')).default }) },
          { path: 'roles/create', lazy: async () => ({ Component: (await import('@features/management/role/create-new-role')).CreateNewRoleComponent }) },
        ]
      }
    ]
  },
  LoginRouter
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

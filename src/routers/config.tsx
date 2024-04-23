import { Navigate, redirect } from "react-router-dom";
// import ErrorPage from "@features/error/error";
import Layout from "@features/layout/layout";
import { protectedLoader } from "./protectedLoader";
import { loginLoader } from "./loginLoader";
import { authProvider } from "@services/auth.service";

const accountRouters = [
  {
    path: "accounts",
    lazy: async () => ({
      Component: (await import("@features/management/account/account-list.component"))
        .default,
    }),
  },
  {
    path: "accounts/create",
    lazy: async () => ({
      Component: (await import("@features/management/account/account-create.component"))
        .default,
    }),
  },
  {
    path: "accounts/:id",
    lazy: async () => ({
      Component: (await import("@features/management/account/account-edit.component"))
        .default,
    }),
  }
];

const rolesRouters = [
  {
    path: "roles",
    lazy: async () => ({ Component: (await import("@features/management/role/role-list.component")).default }),
  },
  {
    path: "roles/create",
    lazy: async () => ({ Component: ( await import("@features/management/role/role-detail-create.component")).default }),
  },
  {
    path: "roles/:id/edit",
    lazy: async () => ({ Component: ( await import("@features/management/role/role-detail-edit.component")).default }),
  },
  {
    path: "roles/:id",
    lazy: async () => ({ Component: ( await import("@features/management/role/role-detail-view.component")).default }),
  }
];

export const routesConfig = [
  {
    path: "/",
    Component: Layout,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        loader: protectedLoader,
        lazy: async () => ({
          Component: (await import("@features/welcome/welcome")).default,
        }),
      },
      {
        path: "customs",
        children: [
          {
            path: "basic-data",
            lazy: async () => ({ Component: (await import("@features/customs/basic-data")).default }),
          },
          {
            path: "declareation",
            lazy: async () => ({ Component: (await import("@features/customs/declareation")).default }),
          },
          {
            path: "risk-control",
            lazy: async () => ({ Component: (await import("@features/customs/risk-control")).default }),
          },
        ],
      },
      {
        path: "data-template",
        children: [
          {
            path: "maintenance",
            lazy: async () => ({
              Component: (await import("@features/data-template/maintenance"))
                .default,
            }),
          },
          {
            path: "add",
            lazy: async () => ({
              Component: (await import("@features/data-template/addition"))
                .default,
            }),
          },
        ],
      },
      {
        path: "trajectory",
        children: [
          {
            path: "maintenance",
            lazy: async () => ({
              Component: (await import("@features/trajectory/maintenance"))
                .default,
            }),
          },
        ],
      },
      {
        path: "management",
        children: [
          ...accountRouters,
          ...rolesRouters,
        ],
      },
    ],
  },
  {
    path: "/login",
    loader: loginLoader,
    lazy: async () => ({
      Component: (await import("@features/login/login")).Page,
    }),
  },
  {
    path: "/logout",
    async action() {
      await authProvider.signout();
      return redirect("/");
    },
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];

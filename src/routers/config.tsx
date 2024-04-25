import { RouteObject, redirect } from "react-router-dom";
import Layout from "@features/layout/layout";
import { loginLoader } from "./loginLoader";
import { authProvider } from "@services/auth.service";

export const routesConfig: RouteObject[] = [
  {
    path: "/",
    // loader: protectedLoader, // 会导致无法直接访问子路由
    Component: Layout,
    children: [
      {
        path: "/",
        lazy: async () => ({
          Component: (await import("@features/welcome/welcome")).default,
        }),
      },
      {
        path: "/customs",
        children: [
          {
            path: "clearance-of-goods",
            lazy: async () => ({
              Component: (await import("@features/customs/clearance-of-goods"))
                .default,
            }),
          },
          {
            path: "declare-status",
            lazy: async () => ({
              Component: (await import("@features/customs/declare-status"))
                .default,
            }),
          },
          {
            path: "declaration",
            lazy: async () => ({
              Component: (await import("@features/customs/declaration"))
                .default,
            }),
          },
          {
            path: "template",
            lazy: async () => ({
              Component: (await import("@features/customs/template"))
                .default,
            }),
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
        ],
      },
      {
        path: "/pm",
        children: [
          {
            path: "/pm/roles",
            children: [
              {
                path: "/pm/roles",
                lazy: async () => ({
                  Component: (
                    await import("@features/pm/role/role-list.component")
                  ).default,
                }),
              },
              {
                path: "/pm/roles/create",
                lazy: async () => ({
                  Component: (
                    await import(
                      "@features/pm/role/role-detail-create.component"
                    )
                  ).default,
                }),
              },
              {
                path: "/pm/roles/:id/edit",
                lazy: async () => ({
                  Component: (
                    await import("@features/pm/role/role-detail-edit.component")
                  ).default,
                }),
              },
              {
                path: "/pm/roles/:id",
                lazy: async () => ({
                  Component: (
                    await import("@features/pm/role/role-detail-view.component")
                  ).default,
                }),
              },
            ],
          },
          {
            path: "/pm/accounts",
            children: [
              {
                path: "/pm/accounts",
                lazy: async () => ({
                  Component: (
                    await import("@features/pm/account/account-list.component")
                  ).default,
                }),
              },
              {
                path: "/pm/accounts/create",
                lazy: async () => ({
                  Component: (
                    await import(
                      "@features/pm/account/account-create.component"
                    )
                  ).default,
                }),
              },
              {
                path: "/pm/accounts/:id",
                lazy: async () => ({
                  Component: (
                    await import("@features/pm/account/account-edit.component")
                  ).default,
                }),
              },
            ],
          },
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
];

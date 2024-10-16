import { RouteObject, redirect } from "react-router-dom";
import Layout from "@features/layout/layout";
import { loginLoader } from "./loginLoader";
import { authProvider } from "@services/auth.service";
import Welcome from "@features/welcome/welcome";

const template: RouteObject[] = [
  {
    path: "/customs/template",
    lazy: async () => ({
      Component: (await import("@features/customs/template-list.component"))
        .default,
    }),
  },
  {
    path: "/customs/template/create",
    lazy: async () => ({
      Component: (
        await import("@features/customs/custom-template-create.component")
      ).default,
    }),
  },
  {
    path: "/customs/template/:id/edit",
    lazy: async () => ({
      Component: (
        await import("@features/customs/custom-template-edit.component")
      ).default,
    }),
  },
  {
    path: "/customs/template/:id",
    lazy: async () => ({
      Component: (
        await import("@features/customs/custom-template-detail.component")
      ).default,
    }),
  },
  {
    path: "/customs/waybill-statistics",
    lazy: async () => ({
      Component: (
        await import("@features/customs/waybill-statistics.component")
      ).default,
    }),
  },
];

const trajectory: RouteObject[] = [
  {
    path: "/customs/trajectory/bill-of-lading",
    lazy: async () => ({
      Component: (
        await import(
          "@features/trajectory/bill-of-lading/bill-of-lading.component"
        )
      ).default,
    }),
  },
  {
    path: "/customs/trajectory/clearance",
    lazy: async () => ({
      Component: (
        await import(
          "@features/trajectory/bill-of-lading/clearance.component"
        )
      ).default,
    }),
  },
  {
    path: "/customs/trajectory/packages",
    lazy: async () => ({
      Component: (
        await import("@features/trajectory/packages/packages.component")
      ).default,
    }),
  },
  {
    path: "/customs/trajectory/track-info",
    lazy: async () => ({
      Component: (
        await import("@features/trajectory/track-log/track-log.component")
      ).default,
    }),
  },
  {
    path: "/customs/trajectory/track-trace",
    lazy: async () => ({
      Component: (
        await import("@features/trajectory/track-trace/track-trace.component")
      ).default,
    }),
  },
];

const rm: RouteObject[] = [
  {
    path: "/customs/rm/customer",
    lazy: async () => ({
      Component: (
        await import("@features/customs/RM/customer-info-list.component")
      ).default,
    }),
  },
];

const roles: RouteObject[] = [
  {
    path: "/pm/roles",
    lazy: async () => ({
      Component: (await import("@features/pm/role/role-list.component"))
        .default,
    }),
  },
  {
    path: "/pm/roles/create",
    lazy: async () => ({
      Component: (
        await import("@features/pm/role/role-detail-create.component")
      ).default,
    }),
  },
  {
    path: "/pm/roles/:id/edit",
    lazy: async () => ({
      Component: (await import("@features/pm/role/role-detail-edit.component"))
        .default,
    }),
  },
  {
    path: "/pm/roles/:id",
    lazy: async () => ({
      Component: (await import("@features/pm/role/role-detail-view.component"))
        .default,
    }),
  },
];

const accounts: RouteObject[] = [
  {
    path: "/pm/accounts",
    lazy: async () => ({
      Component: (await import("@features/pm/account/account-list.component"))
        .default,
    }),
  },
  {
    path: "/pm/accounts/create",
    lazy: async () => ({
      Component: (await import("@features/pm/account/account-create.component"))
        .default,
    }),
  },
  {
    path: "/pm/accounts/:id",
    lazy: async () => ({
      Component: (await import("@features/pm/account/account-edit.component"))
        .default,
    }),
  },
];

const Warehouse: RouteObject[] = [
  {
    path: "/warehouse/prediction/list",
    lazy: async () => ({
      Component: (await import("@features/warehouse/prediction/prediction.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/prediction/create",
    lazy: async () => ({
      Component: (await import("@features/warehouse/prediction/prediction-create.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/prediction/edit/:id",
    lazy: async () => ({
      Component: (await import("@features/warehouse/prediction/prediction-edit.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/prediction/add",
    lazy: async () => ({
      Component: (await import("@features/warehouse/prediction/prediction-add.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/outbound/list",
    lazy: async () => ({
      Component: (await import("@features/warehouse/outbound/outbound.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/exception/deduction",
    lazy: async () => ({
      Component: (await import("@features/warehouse/exception/deduction.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/cargo/query",
    lazy: async () => ({
      Component: (await import("@features/warehouse/cargo-track/cargo-track.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/pallet/info",
    lazy: async () => ({
      Component: (await import("@features/warehouse/pallet/pallet-info.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/exception/problem",
    lazy: async () => ({
      Component: (await import("@features/warehouse/exception/problem.component"))
          .default,
    }),
  },
  {
    path: "/warehouse/uld/info",
    lazy: async () => ({
      Component: (await import("@features/warehouse/uld/uld-manage.component"))
        .default,
    }),
  },
]

const BaseInfo: RouteObject[] = [
  {
    path: "/baseinfo/vendor/list",
    lazy: async () => ({
      Component: (await import("@features/baseinfo/vendor/vendor-info.component"))
        .default,
    }),
  },
  {
    path: "/baseinfo/vendor/create",
    lazy: async () => ({
      Component: (await import("@features/baseinfo/vendor/vendor-info-create.component"))
        .default,
    }),
  },
  {
    path: "/baseinfo/vendor/edit/:id",
    lazy: async () => ({
      Component: (await import("@features/baseinfo/vendor/vendor-info-edit.component"))
        .default,
    }),
  },
]

export const routesConfig: RouteObject[] = [
  {
    path: "/",
    // loader: protectedLoader, // 会导致无法直接访问子路由
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Welcome,
      },
      {
        path: "/customs",
        Component: Welcome,
      },
      {
        path: "/pm",
        Component: Welcome,
      },
      {
        path: "/warehouse",
        Component: Welcome,
      },
      {
        path: "/baseinfo",
        Component: Welcome,
      },
      {
        path: "/warehouse",
        children: [...Warehouse],
      },
      {
        path: "/baseinfo",
        children: [...BaseInfo],
      },
      {
        path: "/customs",
        children: [
          {
            path: "/customs/package-change",
            lazy: async () => ({
              Component: (
                await import(
                  "@features/customs/package-change/package-change.component"
                )
              ).default,
            }),
          },
          {
            path: "/customs/clearance-of-goods",
            lazy: async () => ({
              Component: (
                await import("@features/customs/clearance-of-goods.component")
              ).default,
            }),
          },
          {
            path: "/customs/declare-status",
            lazy: async () => ({
              Component: (
                await import(
                  "@features/customs/declare-status/declare-status.component"
                )
              ).default,
            }),
          },
          {
            path: "/customs/declaration",
            lazy: async () => ({
              Component: (
                await import(
                  "@features/customs/declaration/declaration.component"
                )
              ).default,
            }),
          },
          ...template,
          ...trajectory,
          ...rm,
        ],
      },
      {
        path: "/pm",
        children: [...roles, ...accounts],
      },
      {
        path: "/change-passwd",
        lazy: async () => ({
          Component: (
            await import("@features/pm/account/change-passwd.component")
          ).default,
        }),
      },
      {
        path: "/error/403",
        lazy: async () => ({
          Component: (await import("@features/error/403")).default,
        }),
      },
      {
        path: "*",
        lazy: async () => ({
          Component: (await import("@features/error/404")).default,
        }),
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
    lazy: async () => ({
      Component: (await import("@features/error/404")).default,
    }),
  },
];

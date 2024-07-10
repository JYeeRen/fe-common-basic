import { useCallback, useEffect, useMemo, useState } from "react";
import localStorage from "@services/localStorage";
import { t } from "@locale";
import { useLocation } from "react-router-dom";
import { debug } from "@infra";
import appService from "@services/app.service";

interface SideNavItem {
  key: string;
  label: string;
  permission?: string;
  children?: (SideNavItem & { permission?: string })[];
}

interface TopNavItem {
  key: string;
  label: string;
  permissions?: string[];
  sidenavs: (SideNavItem & { permission?: string })[];
}

// https://global.lianlianpay.com/article_foreign_trade/33-56542.html
const navConfig = (): TopNavItem[] => [
  {
    key: "customs",
    label: t("关务风控"),
    permissions: [
      // "customs.item",
      "customs.item",
      "customs.status",
      "customs.document",
      "customs.template",
      "track.mawb",
      "track.package",
      "track.log",
      "track.status",
      "risk.customer",
    ],
    sidenavs: [
      {
        key: "/customs",
        label: t("关务单证"),
        children: [
          {
            key: "/customs/package-change",
            label: t("包裹变动状态"),
            // permission: "customs.item",
          },
          {
            key: "/customs/clearance-of-goods",
            label: t("商品详细信息"),
            permission: "customs.item",
          },
          {
            key: "/customs/declare-status",
            label: t("提单关务状态"),
            permission: "customs.status",
          },
          {
            key: "/customs/declaration",
            label: t("清关单证制作"),
            permission: "customs.document",
          },
          {
            key: "/customs/template",
            label: t("模板维护"),
            permission: "customs.template",
          },
        ],
      },
      {
        key: "/customs/trajectory",
        label: t("轨迹维护"),
        children: [
          {
            key: "/customs/trajectory/bill-of-lading",
            label: t("提单信息录入"),
            permission: "track.mawb",
          },
          {
            key: "/customs/trajectory/packages",
            label: t("包裹信息录入"),
            permission: "track.package",
          },
          {
            key: "/customs/trajectory/track-info",
            label: t("轨迹信息"),
            permission: "track.log",
          },
          {
            key: "/customs/trajectory/track-trace",
            label: t("货物状态跟踪"),
            permission: "track.status",
          },
        ],
      },
      {
        key: "/customs/rm",
        label: t("关务风控"),
        children: [
          {
            key: "/customs/rm/customer",
            label: t("客户信息"),
            permission: "risk.customer",
          },
        ],
      },
    ],
  },
  {
    key: "pm",
    label: t("权限管理"),
    permissions: ["admin.account", "admin.role"],
    sidenavs: [
      {
        key: "/pm/accounts",
        label: t("账号管理"),
        permission: "admin.account",
      },
      {
        key: "/pm/roles",
        label: t("角色管理"),
        permission: "admin.role",
      },
    ],
  },
  {
    key: "warehouse",
    label: t("仓库管理"),
    permissions: [
      "warehouse.receipt",
      "warehouse.order",
      "warehouse.deduction",
      "warehouse.track",
      "warehouse.pallet",
      "warehouse.receipt_issue",
    ],
    sidenavs: [
      {
        key: "/warehouse/prediction",
        label: t("预报管理"),
        children: [
          {
            key: "/warehouse/prediction/list",
            label: t("入库预报"),
            permission: "warehouse.receipt"
          },
          {
            key: "/warehouse/outbound/list",
            label: t("出库预报"),
            permission: "warehouse.order"
          }
        ]
      },
      {
        key: "/warehouse/exception",
        label: t("异常处理"),
        children: [
          {
            key: "/warehouse/exception/deduction",
            label: t("扣货管理"),
            permission: "warehouse.deduction"
          },
          {
            key: "/warehouse/exception/problem",
            label: t("问题件管理"),
            permission: "warehouse.receipt_issue"
          }
        ]
      },
      {
        key: "/warehouse/cargo",
        label: t("货物跟踪"),
        children: [
          {
            key: "/warehouse/cargo/query",
            label: t("货物查询"),
            permission: "warehouse.track"
          }
        ]
      },
      {
        key: "/warehouse/pallet",
        label: t("托盘管理"),
        children: [
          {
            key: "/warehouse/pallet/info",
            label: t("托盘信息管理"),
            permission: "warehouse.pallet"
          }
        ]
      },
    ],
  }
];

export const useMenuCtrl = () => {
  const location = useLocation();
  const [topnav, setTopnav] = useState<string>(location.pathname.split("/")[1]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    location.pathname,
  ]);

  useEffect(() => {
    debug.features("locaton change", location);
    setTopnav(location.pathname.split("/")[1]);
    setSelectedKeys([location.pathname]);
  }, [location]);

  debug.features("location", location, "selected", selectedKeys);

  const onOpenChange = useCallback(
    (openKeys: string[]) => localStorage.setSideMenuOpenKeys(openKeys),
    []
  );

  const config = useMemo(() => navConfig(), []);

  const permissionDict = appService.permissionDict;

  const topnavs = useMemo(() => {
    return config
      .filter((item) => {
        if (localStorage.getItem("user")?.isManager) {
          return true;
        }
        if (!item.permissions) {
          return true;
        }
        return item.permissions?.some((item) => permissionDict[item]);
      })
      .map(({ key, label }) => ({ key, label }));
  }, [config, permissionDict]);

  const sidenavs = useMemo(() => {
    const originItems =
      config.find((item) => item.key === topnav)?.sidenavs || [];
    if (localStorage.getItem("user")?.isManager) {
      return originItems;
    }

    const navs: TopNavItem["sidenavs"] = [];
    originItems.forEach((item) => {
      if (!item.children?.length) {
        if (item.permission && permissionDict[item.permission]) {
          navs.push(item);
        }
        return;
      }

      const children = item.children?.filter(
        (child) => permissionDict[child.permission ?? "_"] ?? false
      );

      if (children.length) {
        navs.push({ ...item, children });
      }
    });
    return navs;
  }, [config, permissionDict, topnav]);

  const defaultOpenKeys = useMemo(() => localStorage.getSideMenuOpenKeys(), []);

  return {
    topnav,
    topnavs,
    sidenavs,
    defaultOpenKeys,
    selectedKeys,
    onOpenChange,
    setTopnav,
  };
};

import { useCallback, useMemo, useState } from "react";
import localStorage from '@services/localStorage';
import { t } from "@locale";
import { useLocation } from "react-router-dom";

interface SideNavItem {
  key: string;
  label: string;
  children?: SideNavItem[];
}

interface TopNavItem {
  key: string;
  label: string;
  sidenavs: SideNavItem[];
}

// https://global.lianlianpay.com/article_foreign_trade/33-56542.html
const navConfig = (): TopNavItem[] => [
  {
    key: "customs",
    label: t("关务风控"),
    sidenavs: [
      {
        key: "/customs",
        label: t("关务单证"),
        children: [
          {
            key: "/customs/clearance-of-goods",
            label: t("商品详细信息"),
          },
          {
            key: "/customs/declare-status",
            label: t("提单关务状态"),
          },
          {
            key: "/customs/declaration",
            label: t("清关单证制作"),
          },
          { key: "/customs/template", label: t("模板维护") },
        ],
      },
      {
        key: "/customs/trajectory",
        label: t("轨迹维护"),
        children: [
          { key: "/customs/trajectory/maintenance", label: t("轨迹维护") },
        ],
      },
    ],
  },
  {
    key: "pm",
    label: t("权限管理"),
    sidenavs: [
      { key: "/pm/accounts", label: t("账号管理") },
      { key: "/pm/roles", label: t("权限管理") },
    ],
  },
];

export const useMenuCtrl = () => {
  const location = useLocation();
  const [topnav, setTopnav] = useState<string>(location.pathname.split('/')[1]);

  const defaultSelectedKeys = useMemo(() => [location.pathname], [location]);
  const onOpenChange = useCallback((openKeys: string[]) => localStorage.setSideMenuOpenKeys(openKeys), [])
  const config = useMemo(() => navConfig(), []);
  const topnavs = useMemo(
    () => config.map(({ key, label }) => ({ key, label })),
    [config]
  );
  const sidenavs = useMemo(
    () => config.find((item) => item.key === topnav)?.sidenavs || [],
    [config, topnav]
  );

  const defaultOpenKeys = useMemo(() => localStorage.getSideMenuOpenKeys(), []);

  return {
    topnav, topnavs, sidenavs, defaultOpenKeys, defaultSelectedKeys, onOpenChange, setTopnav
  };
};

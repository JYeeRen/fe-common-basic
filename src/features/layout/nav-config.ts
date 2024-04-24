import { t } from '@locale';
import { chain } from 'lodash';

interface NavItem2 {
  key: string;
  label: string;
  children?: NavItem2[];
}

export type NavConfig = {
  key: string;
  label: string;
  sidenavs: NavItem2[];
}[];

export const topnavConfig = (): NavConfig => [
  {
    key: "customs_risk_control",
    label: t("关务风控"),
    sidenavs: [
      {
        key: "/customs",
        label: "关务",
        children: [
          { key: "/customs/basic-data", label: "关务基础数据" },
          { key: "/customs/declareation", label: "关务单证" },
          { key: "/customs/risk-control", label: "关务风控" },
        ],
      },
      {
        key: "/data-template",
        label: "资料模板",
        children: [
          { key: "/data-template/maintenance", label: "资料模板维护" },
          { key: "/data-template/add", label: "资料模板新增" },
        ],
      },
      {
        key: "/trajectory",
        label: "轨迹维护",
        children: [
          { key: "/trajectory/maintenance", label: "轨迹维护" },
        ],
      },
    ]
  },
  {
    key: "permission_mgmt",
    label: t("权限管理"),
    sidenavs: [
      { key: '/management/accounts', label: t('账号管理') },
      { key: '/management/roles', label: t('权限管理') },
    ]
  },
];

export const formatNavItems = ((navItems: NavItem[]) => {
  return chain(navItems)
    .map(item => ({ group: item.group, key: item.key, label: item.label }))
    .groupBy('top')
    .value()
});

interface NavItem {
  top: string;
  group: string;
  key: string;
  label: string;
}

export const getNavItems = () => [
  { top: '关务风控', group: '关务单证', key: "/customs/basic-data", label: t("商品详细信息") },
  { top: '关务风控', group: '关务单证', key: "/customs/declareation", label: t("提单关务状态" ) },
  { top: '关务风控', group: '关务单证', key: "/customs/risk-control", label: t("清关单证制作") },
  { top: '关务风控', group: '关务单证', key: "/customs/risk-control", label: t("模板维护") },
  { top: '关务风控', group: '轨迹维护', key: "/", label: t("菜单名称") },
  { top: '关务风控', group: '轨迹维护', key: "/", label: t("菜单名称") },
  { top: '关务风控', group: '轨迹维护', key: "/", label: t("菜单名称") },
  { top: '权限管理', group: '权限管理', key: '/management/accounts', label: t('账号管理') },
  { top: '权限管理', group: '权限管理', key: '/management/roles', label: t('权限管理') },
];
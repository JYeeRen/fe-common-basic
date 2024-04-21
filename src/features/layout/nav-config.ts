import { t } from '@locale';

export const topnavConfig = () => [
  {
    key: "customs_risk_control",
    label: t("关务风控"),
    subs: [
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
    subs: [
      { key: '/management/accounts', label: t('账号管理') },
      { key: '/management/roles', label: t('权限管理') },
    ]
  },
];

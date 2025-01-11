import { debug } from "@infra";
import { authProvider } from "@services/auth.service";
import { PropsWithChildren, useEffect, useMemo } from "react";
import {
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import appService from "@services/app.service";
import localStorage from '@services/localStorage';

const routerPermission: Record<string, string> = {
  // 商品详细信息
  "/customs/clearance-of-goods": "customs.item",
  // 提单关务状态
  "/customs/declare-status": "customs.status",
  // 清关单证制作
  "/customs/declaration": "customs.document",
  // 模板维护
  "/customs/template": "customs.template",
  "/customs/template/create": "customs.template",
  "/customs/template/:id/edit": "customs.template",
  "/customs/template/:id": "customs.template",
  // 提单信息录入
  "/customs/trajectory/bill-of-lading": "track.mawb",
  // 包裹信息录入
  "/customs/trajectory/packages": "track.package",
  // 轨迹信息
  "/customs/trajectory/track-info": "track.log",
  // 货物状态跟踪
  "/customs/trajectory/track-trace": "track.status",
  // 客户信息
  "/customs/rm/customer": "risk.customer",
  // 账号管理
  "/pm/accounts": "admin.account",
  "/pm/accounts/create": "admin.account",
  "/pm/accounts/:id": "admin.account",
  // 角色管理
  "/pm/roles": "admin.role",
  "/pm/roles/create": "admin.role",
  "/pm/roles/:id/edit": "admin.role",
  "/pm/roles/:id": "admin.role",
  // 仓库管理
  "/warehouse/prediction/list": "warehouse.receipt",
  "/warehouse/prediction/create": "warehouse.receipt",
  "/warehouse/prediction/edit/:id": "warehouse.receipt",
  "/warehouse/prediction/add": "warehouse.receipt",
  "/warehouse/cargo/query": "warehouse.track",
  "/warehouse/outbound/list": "warehouse.order",
  "/warehouse/exception/deduction": "warehouse.deduction",
  "/warehouse/pallet/info": "warehouse.pallet",
  "/warehouse/exception/problem": "warehouse.receipt_issue",
  "/warehouse/uld/info": "warehouse.uld",
  // 基础资料更新
  "/baseinfo/vendor/list": "basic_information.vendor",
  "/baseinfo/vendor/create": "basic_information.vendor",
  "/baseinfo/vendor/edit/:id": "basic_information.vendor",
};

export function ProtectedRoute(props: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=> {
    if (authProvider.resetPwd && location.pathname !== "/change-passwd") {
      navigate("/change-passwd", { replace: true });
    }
  }, [location.pathname]);

  const routes = useMemo(() => Object.keys(routerPermission), []);
  useEffect(() => {
    debug.infra("ProtectedRoute", "location change");
    const matched = routes.find(route => matchPath({ path: route, end: true }, location.pathname));
    debug.infra('匹配到路由', matched);
    const permission = routerPermission[(matched ?? '')];
    if (permission != null) {
      debug.infra('检查权限', permission);
      const isManager = localStorage.getItem('user')?.isManager ?? false;
      const permissionMatch = appService.permissionDict[permission] ?? false;
      debug.infra('管理员', isManager, '拥有权限', permissionMatch);
      if (!(isManager || permissionMatch)) {
        debug.infra('无权限，跳转 403');
        navigate('/error/403', { replace: true });
      }
    } else {
      debug.infra('公开页面');
    }
  }, [location, navigate, routes]);

  useEffect(() => {
    if (!authProvider.isAuthenticated) {
      const params = new URLSearchParams();
      params.set("from", location.pathname);
      navigate(`/login?${params.toString()}`, { replace: true });
    }
  }, []);

  return props.children;
}

import { PropsWithChildren, useEffect } from "react";
import { App } from "@components";
import localStorage from "@services/localStorage";
import { useLocation, useNavigate } from "react-router-dom";
import { authProvider } from "@services/auth.service";

export const GuardRoute = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const { message } = App.useApp();

  const location = useLocation();

  useEffect(() => {
    if (authProvider.resetPwd && location.pathname !== "/change-passwd") {
      navigate("/change-passwd", { replace: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      message.error("登录已过期，请重新登录");
      navigate("/login", { replace: true });
    }
  }, [message, navigate]);

  return <>{children}</>;
};

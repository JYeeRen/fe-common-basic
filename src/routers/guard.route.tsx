import { PropsWithChildren, useEffect } from "react";
import { App } from "@components";
import localStorage from "@services/localStorage";
import { useNavigate } from "react-router-dom";

export const GuardRoute = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const { message } = App.useApp();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      message.error("登录已过期，请重新登录");
      navigate("/login", { replace: true });
    }
  }, [message, navigate]);

  return <>{children}</>;
};

import { authProvider } from '@services/auth.service';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function ProtectedRoute(props: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authProvider.isAuthenticated) {
      const params = new URLSearchParams();
      params.set("from", location.pathname);
      navigate(`/login?${params.toString()}`);
    }
  }, []);

  return props.children;
}
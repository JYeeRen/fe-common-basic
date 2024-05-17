/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Container, Result } from "@components";
import { useTranslation } from "react-i18next";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Result
      status="500"
      title="500"
      subTitle={error?.statusText || error?.message}
      extra={<Button type="primary" onClick={() => navigate('/', { replace: true })}>{t('返回首页')}</Button>}
    />
    </Container>
  );
}

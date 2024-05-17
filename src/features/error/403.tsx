/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@components";
import { useTranslation } from "@locale";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function E403() {

  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Result
      status="403"
      title="403"
      subTitle={t('你没有权限访问此页面')}
      extra={<Button type="primary" onClick={() => navigate('/', { replace: true })}>{t('返回首页')}</Button>}
    />
    </Container>
  );
}

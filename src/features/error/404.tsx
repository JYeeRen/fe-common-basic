/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@components";
import { useTranslation } from "@locale";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function E404() {

  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Result
      status="404"
      title="404"
      subTitle={t('你访问的页面不存在')}
      extra={<Button type="primary" onClick={() => navigate('/', { replace: true })}>{t('返回首页')}</Button>}
    />
    </Container>
  );
}

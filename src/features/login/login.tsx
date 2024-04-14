import assert from "assert";
import { observer } from "mobx-react-lite";
import { Form, Button, Input, Layout, Card, Tabs } from "@components";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import * as authService from "@services/auth.service";
import styles from "./login.module.less";
import { useNavigate, useSearchParams } from "react-router-dom";

function Login() {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  console.log(params.get('redirect'));

  const handleLogin = async () => {
    try {
      const { username, password } = await form.validateFields();
      assert(username);
      assert(password);
      await authService.signIn({ username, password });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header}>
        <div className={styles.main}>
          <div className={styles.logo}>LOGO</div>
          <span className={styles.path}>登录</span>
        </div>
      </Layout.Header>
      <Layout.Content>
        <Card
          className="w-[423px] min-h-[518px] flex items-center mx-auto justify-center rounded-none"
          classNames={{ body: 'w-5/6' }}
        >
          <div className="w-full flex justify-center">
            <Tabs
              className="w-4/5 mb-8"
              items={[{ label: "账号密码登录", key: "passwd" }]}
              centered
            />
          </div>
          <Form form={form} layout="vertical" className="w-full mx-auto">
            <Form.Item label="" name="username" rules={[{ required: true }]}>
              <Input className={styles.input} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="" name="password" rules={[{ required: true }]}>
              <Input.Password
                className={styles.input}
                placeholder="请输入密码"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={handleLogin}
                className="w-full"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
      <Layout.Footer className="bg-transparent" />
    </Layout>
  );
}

export const Page = observer(Login);

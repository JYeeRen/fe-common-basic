import {
  Button,
  Container,
  Form,
  Input,
  Space,
  SubmitButton,
} from "@components";
import { useStore } from "@hooks";
import { ChangePasswdStore } from "./change-passwd.store";
import { observer } from "mobx-react-lite";
import styles from "./change-passwd.module.less";

function ChangePasswdComponent() {
  const { store, t, navigate } = useStore(ChangePasswdStore)();

  const [form] = Form.useForm();

  const onFinish = async (values: { oldPassword: string; newPassword: string }) => {
    await store.changePasswd(values);
    navigate("/", { replace: true });
  };

  return (
    <Container title={t("修改密码")} loading={store.loading}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        className={styles.form}
        onFinish={onFinish}
      >
        <Form.Item
          name="oldPassword"
          label={t("旧密码")}
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={t("新密码")}
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={t("确认密码")}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("两次输入的密码不一致")));
              },
            }),
          ]}
          dependencies={["newPassword"]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <div className="flex items-center justify-center">
            <Space size={60}>
              <SubmitButton form={form}>{t("提交")}</SubmitButton>
              <Button htmlType="reset" className="operation-btn">
                {t("重置")}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Container>
  );
}

const ChangePasswd = observer(ChangePasswdComponent);

export default ChangePasswd;

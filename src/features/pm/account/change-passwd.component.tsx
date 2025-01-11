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
import { RuleObject } from "antd/es/form";

function ChangePasswdComponent() {
  const { store, t, navigate } = useStore(ChangePasswdStore)();

  const [form] = Form.useForm();

  const onFinish = async (values: { oldPassword: string; newPassword: string }) => {
    await store.changePasswd(values);
    navigate("/", { replace: true });
  };

  const passwordValidator = (_: RuleObject, value: string) => {
    if (!value) {
      return Promise.reject(t('请输入密码'));
    }
  
    const lengthValid = /^.{8,20}$/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  
    const typesCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
    if (!lengthValid) {
      return Promise.reject(t('密码长度需为8-20位'));
    }
  
    if (typesCount < 2) {
      return Promise.reject(t('密码需至少包含两种不同类型的字符（大写字母、小写字母、数字、符号）'));
    }
  
    return Promise.resolve();
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
          rules={[
            { validator: passwordValidator }
          ]}
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

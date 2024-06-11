import {
  Button,
  Container,
  Form,
  SubmitButton,
  Input,
  Space,
  Switch,
  Block,
  SearchSelect,
} from "@components";
import { useTranslation } from "@locale";
import { useEffect } from "react";
import styles from "./account-detail.module.less";
import { AccountParams } from "./types";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface RoleDetailProps {
  onCommit: (params: AccountParams) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: any;
  roleOptions: { id: number; val: string }[];
  title: string;
  loading?: boolean;
}

function AccountDetailComponent(props: RoleDetailProps) {
  const { title, onCommit, initialValues, loading } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = (values: any) => {
    const { roleId, ...restFields } = values;
    onCommit({ roleId: Number(roleId), ...restFields });
  };

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
};


  return (
    <Container title={title} loading={loading}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        form={form}
        className={styles.form}
        onFinish={handleFinish}
        onReset={onReset}
      >
        <Form.Item
          label={t("用户账号")}
          name="account"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("用户账号")} />
        </Form.Item>
        <Form.Item
          label={t("用户名称")}
          name="username"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("用户名称")} />
        </Form.Item>
        <Form.Item
          label={t("选择角色")}
          name="roleId"
          rules={[{ required: true }]}
        >
          <SearchSelect optionKey="roles" />
        </Form.Item>
        <Form.Item label={t("启用状态")} name="active">
          <Switch checkedChildren={t("启用")} unCheckedChildren={t("停用")} />
        </Form.Item>
        <Block if={true}>
          <Form.Item
            label={
              <span className={styles.passwdLabel}>
                <ExclamationCircleOutlined className={styles.icon} />
                {t("登录密码")}
              </span>
            }
          >
            <span className={styles.passwdTips}>
              {t("新账号初始密码为 {{passwd}}", { passwd: "chushimima123" })}
            </span>
          </Form.Item>
        </Block>
        <Form.Item>
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

export default AccountDetailComponent;

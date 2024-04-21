import { chain } from "lodash";
import {
  Button,
  Container,
  Form,
  SubmitButton,
  Input,
  Space,
  Switch,
  Block,
  Table,
  Modal,
  TableProps,
} from "@components";
import { useTranslation } from "@locale";
import { useCallback, useEffect, useMemo } from "react";
import { PermissionGroup } from "./component/permission.component";
import styles from "./role-detail.module.less";
import { Permission, RoleParams, RoleDetail } from "./types";
import { DeleteOutlined } from "@ant-design/icons";

interface RoleDetailProps {
  linkedAccounts?: RoleDetail["linkedAccounts"];
  permissions: Permission[];
  onCommit: (params: RoleParams) => void;
  unlinkAccount?: (accountId: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: any;
}

function RoleDetailComponent(props: RoleDetailProps) {
  const {
    permissions,
    onCommit,
    initialValues,
    linkedAccounts,
    unlinkAccount,
  } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const handleUnlinkAccount = useCallback(
    (accountId: number) => {
      Modal.confirm({
        title: t("操作确认"),
        content: t(
          "解除关联后，该账号不再具有该角色的权限，立即生效，是否确认解除关联？"
        ),
        onOk() {
          unlinkAccount?.(accountId);
        },
      });
    },
    [t, unlinkAccount]
  );

  const linkedAccountColumns = useMemo<TableProps["columns"]>(() => {
    return [
      { key: "id", title: t("ID"), dataIndex: "id" },
      { key: "username", title: t("用户编号"), dataIndex: "username" },
      { key: "account", title: t("用户名称"), dataIndex: "account" },
      {
        key: "operation",
        title: t("操作"),
        render: (_value, record) => {
          return (
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleUnlinkAccount(record.id)}
            >
              {t("解除账号关联")}
            </Button>
          );
        },
      },
    ];
  }, [handleUnlinkAccount, t]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = (values: any) => {
    const { name, active, ...restFields } = values;
    const permissions = chain(restFields)
      .values()
      .compact()
      .flatten()
      .value() as string[];
    onCommit({ name, active, permissions });
  };

  return (
    <Container title={t("新增角色")}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        form={form}
        className={styles.form}
        onFinish={handleFinish}
      >
        <Form.Item
          label={t("角色名称")}
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("内部员工")} />
        </Form.Item>
        <Form.Item label={t("角色状态")} name="active">
          <Switch checkedChildren={t("启用")} unCheckedChildren={t("停用")} />
        </Form.Item>
        <Form.Item label={t("权限设置")}>
          {permissions.map((permission) => (
            <Form.Item key={permission.key} name={permission.key} noStyle>
              <PermissionGroup permission={permission} />
            </Form.Item>
          ))}
        </Form.Item>
        <Block if={Boolean(linkedAccounts)}>
          <Form.Item label={t("关联账号")}>
            <Table
              size="small"
              bordered
              rowKey="id"
              columns={linkedAccountColumns}
              pagination={false}
              dataSource={linkedAccounts}
            />
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

export default RoleDetailComponent;

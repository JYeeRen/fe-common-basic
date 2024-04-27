import { Container, Form, Table } from "@components";
import { useTranslation } from "@locale";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { RoleDetailStore } from "./role-detail.store";
import { PermissionGroup } from "./component/permission.component";
import styles from './role-detail.module.less';
import { useParams } from "react-router-dom";

function RoleDetailComponent() {
  const [store] = useState(new RoleDetailStore());
  const { id } = useParams();
  const [t] = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    store.onLoad(id != null ? Number(id) : undefined);
  }, [id, store]);

  useEffect(() => {
    form.setFieldsValue(store.initialValue);
  }, [form, store.initialValue]);

  const linkedAccountColumns = useMemo(() => {
    return [
      { key: 'id', title: t('ID'), dataIndex: 'id' },
      { key: 'username', title: t('用户编号'), dataIndex: 'username' },
      { key: 'account', title: t('用户名称'), dataIndex: 'account' },
    ];
  }, [t]);

  return (
    <Container title={t("查看角色信息")} loading={store.loading}>
      <Form className={styles.form}>
        <Form.Item
          label={t("当前角色")}
        >
          {store.role?.name}
        </Form.Item>
        <Form.Item label={t("角色状态")}>
          {store.role?.active ? t("已启用") : t("已停用")}
        </Form.Item>
        <Form.Item label={t("权限设置")} labelCol={{ span: 24 }}>
          {store.permissions.map((permission) => (
            <Form.Item
              key={permission.key}
              noStyle
            >
              <PermissionGroup permission={permission} readonly value={store.role?.permissions} />
            </Form.Item>
          ))}
        </Form.Item>
        <Form.Item label={t('关联账号')} labelCol={{ span: 24 }}>
          <Table
            size="small"
            bordered
            rowKey={(record) => record.id.toString()}
            columns={linkedAccountColumns}
            pagination={false}
            dataSource={store.role?.linkedAccounts ?? []}
          />
        </Form.Item>
      </Form>
    </Container>
  );
}

const RoleDetailView = observer(RoleDetailComponent);

export default RoleDetailView;

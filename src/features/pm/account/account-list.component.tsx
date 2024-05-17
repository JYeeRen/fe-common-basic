import {
  Button,
  ClientGrid,
  Container,
  Modal,
  App,
  Table,
  FilterContainer,
  Col,
  Form,
  Input,
  SearchSelect,
} from "@components";
import { observer } from "mobx-react-lite";
import { UsergroupAddOutlined } from "@ant-design/icons";
import * as accountListConfig from "./account-list-config";
import { useTranslation } from "@locale";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { AccountListStore } from "./account-list.store";
import styles from "./account-list.module.less";

function AccountList() {
  const { notification } = App.useApp();
  const [t] = useTranslation();
  const [store] = useState(new AccountListStore());
  const navigate = useNavigate();

  const gridStore = ClientGrid.useGridStore(accountListConfig.getRows);

  const resetPassword = useCallback(
    (id: number, account: string) => {
      Modal.confirm({
        title: t("操作确认"),
        content: t("是否确认将账号 {{account}} 的密码重置为初始密码？", {
          account,
        }),
        async onOk() {
          await store.resetPassword(id);
          notification.success({
            message: t("重置初始密码"),
            description: t("重置初始密码"),
          });
        },
        okText: t("确认"),
        cancelText: t("取消"),
      });
    },
    [notification, store, t]
  );

  const editAccount = useCallback(
    (id: number) => navigate(`/pm/accounts/${id}`),
    [navigate]
  );

  const deleteAccount = useCallback(
    (id: number) => {
      Modal.confirm({
        title: t("操作确认"),
        content: t(
          "警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作"
        ),
        okType: "danger",
        async onOk() {
          await store.delteAccount(id);
          notification.success({
            message: t("用户删除成功"),
            description: t("用户删除成功"),
          });
          gridStore.loadData();
        },
        okText: t("确认删除"),
        cancelText: t("取消"),
      });
    },
    [gridStore, notification, store, t]
  );

  const operations = useMemo(
    () => ({
      resetPassword,
      edit: editAccount,
      delete: deleteAccount,
    }),
    [deleteAccount, editAccount, resetPassword]
  );

  const columns = useMemo(
    () => accountListConfig.getGridColumns(operations),
    [operations]
  );

  const operation = (
    <Button
      className="operation-btn"
      icon={<UsergroupAddOutlined />}
      onClick={() => navigate("/pm/account/create")}
    >
      {t("新增账号")}
    </Button>
  );

  return (
    <Container className={styles.container}>
      <FilterContainer
        onFinish={gridStore.setQueryParams.bind(gridStore)}
        initialValues={{ active: 0 }}
      >
        <Col span={6}>
          <Form.Item name="account" label={t("输入查询")}>
            <Input placeholder={t("用户账号/名称")} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="roleId" label={t("账号角色")}>
            <SearchSelect optionKey="roles" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="activeType" label={t("账号状态")}>
            <SearchSelect placeholder={t('全部')} optionKey="actives" />
          </Form.Item>
        </Col>
      </FilterContainer>
      <div className="w-full"></div>
      <Container title={t("账号列表")} operation={operation}>
        {/* <ClientGrid columns={columns} store={gridStore} /> */}
        <Table
          bordered
          widthFit
          loading={gridStore.loading}
          // rowSelection={{ type: "checkbox" }}
          rowKey="id"
          dataSource={gridStore.rowData}
          columns={columns}
          size="small"
          pagination={{
            total: gridStore.total,
            pageSize: gridStore.pageSize,
            current: gridStore.page,
            showTotal: (total) => t("共{{total}}条", { total }),
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [10, 30, 50, 100, 200, 500],
            defaultPageSize: 50,
            size: "default",
            onChange: gridStore.onTableChange.bind(gridStore),
          }}
        />
      </Container>
    </Container>
  );
}

const AccountListComponent = observer(AccountList);

export default AccountListComponent;

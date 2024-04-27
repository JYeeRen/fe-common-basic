import { Button, ClientGrid, Container, Modal, App } from "@components";
import { observer } from "mobx-react-lite";
import { UsergroupAddOutlined } from "@ant-design/icons";
import * as accountListConfig from "./account-list-config";
import { useTranslation } from "@locale";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AccountListStore } from "./account-list.store";
import { Filter } from "./filter.component";
import styles from "./account-list.module.less";

function AccountList() {
  const { notification } = App.useApp();
  const [t] = useTranslation();
  const [store] = useState(new AccountListStore());
  const navigate = useNavigate();

  const gridStore = useMemo(
    () => new ClientGrid.GridStore(accountListConfig.getRows),
    []
  );

  useEffect(() => (gridStore.loadData(), undefined), []);

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
    (id: number) => navigate(`${id}`),
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
    [notification, store, t]
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
      onClick={() => navigate("create")}
    >
      {t("新增账号")}
    </Button>
  );

  return (
    <Container className={styles.container}>
      <Filter onFinish={gridStore.setQueryParams.bind(gridStore)} />
      <div className="w-full"></div>
      <Container title={t("账号列表")} operation={operation}>
        <ClientGrid columns={columns} store={gridStore} />
      </Container>
    </Container>
  );
}

const AccountListComponent = observer(AccountList);

export default AccountListComponent;

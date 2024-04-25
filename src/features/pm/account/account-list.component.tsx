import { Button, Container, Modal, App, ClientGrid } from "@components";
import { observer } from "mobx-react-lite";
import { UsergroupAddOutlined } from "@ant-design/icons";
import * as accountListConfig from "./account-list-config";
import { useTranslation } from "@locale";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useRef, useState } from "react";
import { AccountListStore } from "./account-list.store";
import { AgGridReact } from "ag-grid-react";

function AccountList() {
  const { notification } = App.useApp();
  const gridRef = useRef<AgGridReact>(null);
  const [t] = useTranslation();
  const [store] = useState(new AccountListStore);
  const navigate = useNavigate();
  
  const resetPassword = useCallback((id: number, account: string) => {
    Modal.confirm({
      title: t('操作确认'),
      content: t('是否确认将账号 {{account}} 的密码重置为初始密码？', { account }),
      async onOk() {
        await store.resetPassword(id);
        notification.success({
          message: t('重置初始密码'),
          description: t('重置初始密码')
        });
        gridRef.current?.api.purgeInfiniteCache();
      },
      okText: t('确认'),
      cancelText: t('取消'),
    });
  }, [notification, store, t]);

  const editAccount = useCallback((id: number) => navigate(`${id}`), [navigate]);

  const deleteAccount = useCallback((id: number) => {
    Modal.confirm({
      title: t('操作确认'),
      content: t('警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作'),
      okType: 'danger',
      async onOk() {
        await store.delteAccount(id);
        notification.success({
          message: t('用户删除成功'),
          description: t('用户删除成功')
        });
        gridRef.current?.api.purgeInfiniteCache();
      },
      okText: t('确认删除'),
      cancelText: t('取消'),
    });
  }, [notification, store, t]);

  const operations = useMemo(() => ({
    resetPassword,
    edit: editAccount,
    delete: deleteAccount
  }), [deleteAccount, editAccount, resetPassword]);

  const columns = useMemo(() => accountListConfig.getGridColumns(operations), [operations]);

  const operation = (
    <Button
      className="operation-btn"
      icon={<UsergroupAddOutlined />}
      onClick={() => navigate('create')}
    >
      {t("新增账号")}
    </Button>
  );

  return (
    <Container title={t("账号列表")} operation={operation}>
      <ClientGrid
        columns={columns}
        getRows={accountListConfig.getRows}
      />
      {/* <AgGrid
        ref={gridRef}
        columns={columns}
        useAsyncData
        getRows={accountListConfig.getRows}
        getTotalCount={accountListConfig.getTotalCount}
      /> */}
    </Container>
  );
}

const AccountListComponent = observer(AccountList);

export default AccountListComponent;

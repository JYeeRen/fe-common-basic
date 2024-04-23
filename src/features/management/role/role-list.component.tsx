import { Button, ClientGrid, Container, Modal, App } from "@components";
import { observer } from "mobx-react-lite";
import { UsergroupAddOutlined } from "@ant-design/icons";
import * as roleListConfig from "./role-list-config";
import { useTranslation } from "@locale";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useRef, useState } from "react";
import { RoleListStore } from "./role-list.store";
import { AgGridReact } from "ag-grid-react";

function RoleList() {
  const { notification } = App.useApp();
  const gridRef = useRef<AgGridReact>(null);
  // const [gridStore] = useState(new ClientGrid.GridStore(roleListConfig.getRows));
  const [t] = useTranslation();
  const [store] = useState(new RoleListStore);
  const navigate = useNavigate();
  const viewRole = useCallback((id: number) => navigate(`${id}`), [navigate]);
  const editRole = useCallback((id: number) => navigate(`${id}/edit`), [navigate]);
  const deleteRole = useCallback((id: number) => {
    Modal.confirm({
      title: t('操作确认'),
      content: t('警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作'),
      okType: 'danger',
      async onOk() {
        await store.delteRole(id);
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
    view: viewRole,
    edit: editRole,
    delete: deleteRole
  }), [deleteRole, editRole, viewRole]);

  const columns = useMemo(() => roleListConfig.getGridColumns(operations), [operations]);

  const operation = (
    <Button
      className="operation-btn"
      icon={<UsergroupAddOutlined />}
      onClick={() => navigate('/management/roles/create')}
    >
      {t("新增角色")}
    </Button>
  );

  return (
    <Container title={t("角色管理")} operation={operation}>
      <ClientGrid
        columns={columns}
        getRows={roleListConfig.getRows}
      />
    </Container>
  );
}

const RoleListComponent = observer(RoleList);

export default RoleListComponent;

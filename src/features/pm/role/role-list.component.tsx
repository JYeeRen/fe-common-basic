import { Button, ClientGrid, Container, Modal, App, Table } from "@components";
import { observer } from "mobx-react-lite";
import { UsergroupAddOutlined } from "@ant-design/icons";
import * as roleListConfig from "./role-list-config";
import { useTranslation } from "@locale";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { RoleListStore } from "./role-list.store";

function RoleList() {
  const { notification } = App.useApp();
  const [t] = useTranslation();
  const [store] = useState(new RoleListStore());
  const gridStore = ClientGrid.useGridStore(roleListConfig.getRows);

  const navigate = useNavigate();
  const viewRole = useCallback((id: number) => navigate(`${id}`), [navigate]);
  const editRole = useCallback(
    (id: number) => navigate(`/pm/roles/${id}/edit`),
    [navigate]
  );
  const deleteRole = useCallback(
    (id: number) => {
      Modal.confirm({
        title: t("操作确认"),
        content: t(
          "警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作"
        ),
        okType: "danger",
        async onOk() {
          await store.delteRole(id);
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
      view: viewRole,
      edit: editRole,
      delete: deleteRole,
    }),
    [deleteRole, editRole, viewRole]
  );

  const columns = useMemo(
    () => roleListConfig.getColumns(operations),
    [operations]
  );

  const operation = (
    <Button
      className="operation-btn"
      icon={<UsergroupAddOutlined />}
      onClick={() => navigate("/pm/roles/create")}
    >
      {t("新增角色")}
    </Button>
  );

  return (
    <Container title={t("角色管理")} operation={operation} table>
      <Table
        bordered
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
          pageSizeOptions: [50, 100, 200, 500],
          defaultPageSize: 50,
          size: "default",
          onChange: gridStore.onTableChange.bind(gridStore),
        }}
      />
    </Container>
  );
}

const RoleListComponent = observer(RoleList);

export default RoleListComponent;

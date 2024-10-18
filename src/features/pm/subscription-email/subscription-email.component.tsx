import { Button, ClientGrid, Container, Modal, App, Table } from "@components";
import { observer } from "mobx-react-lite";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as roleListConfig from "./subscription-email-config";
import { useTranslation } from "@locale";
import { useMemo, useState } from "react";
import { EmailStore } from "./subscription-email.store";
import { CreateModal } from "./subscription-email-create";

function RoleList() {
  const { notification } = App.useApp();
  const [t] = useTranslation();
  const [store] = useState(new EmailStore());
  const gridStore = ClientGrid.useGridStore(roleListConfig.getRows);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns = useMemo(
    () => roleListConfig.getColumns(),
    []
  );

  const handleDelete = () => {
    Modal.confirm({
      title: t("操作确认"),
      content: t(
        "是否确认删除选择的收件人，删除后对应邮箱将无法收到邮件提醒。"
      ),
      okType: "danger",
      onOk: async () => {
        await store.deleteEmails(selectedRowKeys);
        notification.success({
          message: t("删除成功"),
          description: t("删除成功"),
        });
        gridStore.loadData();
      },
      okText: t("确认删除"),
      cancelText: t("取消"),
    });
  };

  const handleCreate = async (email: string) => {
    await store.addEmail(email);
    store.hideCreate();
    gridStore.loadData();
  };

  const operation = (
    <>
      <Button
        className="operation-btn"
        style={{ marginRight: '5px' }}
        icon={<PlusOutlined />}
        onClick={store.showCreate.bind(store)}
      >
        {t("新增")}
      </Button>
      <Button
        className="operation-btn"
        icon={<DeleteOutlined />}
        onClick={handleDelete}
      >
        {t("删除")}
      </Button>
    </>
  );

  return (
    <Container title={t("邮箱管理")} operation={operation} table>
      {store.createVisible && (
        <CreateModal
          onCancel={store.hideCreate.bind(store)}
          onCreate={handleCreate}
        />
      )}
      <Table
        bordered
        loading={gridStore.loading}
        rowSelection={{
          type: "checkbox",
          onChange: (selected) => setSelectedRowKeys(selected as number[])
        }}
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

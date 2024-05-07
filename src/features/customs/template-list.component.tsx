import {
  Button,
  ClientGrid,
  Container,
  Row,
  Table,
  deleteConfirm,
  notification,
} from "@components";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore.hook";
import { TemplateListStore } from "./template-list.store";
import * as CustomTemplateConfig from "./template-list-config";
import styles from "./template-list.module.less";
import { useCallback, useMemo } from "react";
import { CustomTemplateListOperations } from "./types";
import { PlusOutlined } from "@ant-design/icons";
import { CustomTemplateListFilterComponent } from "./component/custom-template-list-filter.component";
import { useHeight } from '@hooks';

function TemplateListComponent() {
  const { store, t, navigate } = useStore(TemplateListStore)();
  const gridStore = ClientGrid.useGridStore(CustomTemplateConfig.getRows);

  const handleDelete = useCallback(
    async (id: number) => {
      await store.deleteTemplate(id);
      gridStore.loadData();
      notification.success({
        message: t("用户删除成功"),
        description: t("用户删除成功"),
      });
    },
    [gridStore, store, t]
  );

  const operations: CustomTemplateListOperations = useMemo(
    () => ({
      edit: (id: number) => navigate(`/customs/template/${id}/edit`),
      delete: (id: number) => {
        deleteConfirm(() => handleDelete(id));
      },
      view: (id) => navigate(`/customs/template/${id}`),
    }),
    [handleDelete, navigate]
  );

  const columns = useMemo(
    () => CustomTemplateConfig.getColumns(operations),
    [operations]
  );

  const handleCreate = useCallback(
    () => navigate("/customs/template/create"),
    []
  );

  const height = useHeight('#table-container');

  const heights = useMemo(() => {
    const container = Math.max(300, height - 36);
    const table = Math.max(200, height - 150);
    return { container, table };
  }, [height]);

  console.log(heights)

  return (
    <Container className={styles.container} loading={store.loading}>
      <CustomTemplateListFilterComponent
        templateTypeOptions={store.templateTypeOptions}
        activeOptions={store.activeOptions}
        onFinish={gridStore.setQueryParams.bind(gridStore)}
      />
      <Container title={t("模板维护")} wrapperClassName={styles.wrapper}>
        <Row className="my-4">
          <Button
            onClick={handleCreate}
            className="operation-btn"
            icon={<PlusOutlined />}
          >
            {t("新增模板")}
          </Button>
        </Row>
        <div
          id="table-container"
          className="w-full overflow-hidden"
          style={{ height: `${heights.container}px` }}
        >
          <Table
            bordered
            loading={gridStore.loading}
            rowSelection={{ type: "checkbox" }}
            rowKey="id"
            dataSource={gridStore.rowData}
            columns={columns}
            size="small"
            scroll={{ y: heights.table }}
            pagination={{
              total: gridStore.total,
              showTotal: (total) => t("共{{total}}条", { total }),
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: [10, 30, 50, 100, 200, 500],
              defaultPageSize: 50,
              size: "default",
              onChange: gridStore.onTableChange.bind(gridStore),
            }}
          />
        </div>
      </Container>
    </Container>
  );
}

const Template = observer(TemplateListComponent);

export default Template;

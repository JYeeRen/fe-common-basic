import {
  Button,
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  Form,
  Input,
  Row,
  Table,
} from "@components";
import { observer } from "mobx-react-lite";
import * as CustomerListConfig from "./customer-info-list-config";
import styles from "./customer-info-list.module.less";
import { useCallback, useMemo } from "react";
import { useStore } from "@hooks";
import { CustomerInfoListStore } from "./customer-info-list.store";
import { CloudDownloadOutlined } from "@ant-design/icons";

function TemplateListComponent() {
  const { store, t } = useStore(CustomerInfoListStore)();
  const gridStore = ClientGrid.useGridStore(CustomerListConfig.getRows);
  const columns = useMemo(() => CustomerListConfig.getColumns(), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const {
      customerName,
      productName,
      productNameCn,
      exportHsCode,
      importHsCode,
    } = values;
    gridStore.setQueryParams({
      customerName: customerName || undefined,
      productName: productName || undefined,
      productNameCn: productNameCn || undefined,
      exportHsCode: exportHsCode || undefined,
      importHsCode: importHsCode || undefined,
    });
  }, []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish}>
        <Col span={6}>
          <Form.Item name="customerName" label={t("客户名称")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="productName" label={t("英文品名")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="productNameCn" label={t("中文品名")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="exportHsCode" label={t("出口 HS CODE")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="importHsCode" label={t("进口 HS CODE")}>
            <Input />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("客户信息")} wrapperClassName={styles.wrapper} table>
        <Row justify="end" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<CloudDownloadOutlined />}
            onClick={store.export.bind(store, gridStore.queryParams as any)}
          >
            {t("导出已筛选数据")}
          </Button>
        </Row>
        <Table
          widthFit
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
    </Container>
  );
}

const Template = observer(TemplateListComponent);

export default Template;

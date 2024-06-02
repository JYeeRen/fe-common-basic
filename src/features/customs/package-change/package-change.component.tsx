import {
  Button,
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  Row,
  Table,
  EditableCell,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import * as gridConfig from "./package-change-config";
import styles from "./package-change.module.less";
import { useCallback, useEffect, useMemo } from "react";
import { useStore } from "@hooks";
import { PackageChangeStore } from "./package-change.store";
import { FormValues } from "./type";
import { CloudUploadOutlined } from "@ant-design/icons";
import { compact } from "lodash";

function PackageChangeComponent() {
  const gridStore = ClientGrid.useGridStore(gridConfig.getRows);
  const { store, t } = useStore(PackageChangeStore, gridStore)(gridStore);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  const columns = useMemo(() => gridConfig.getColumns(), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { masterWaybillNoList } = values;
    const params = { masterWaybillNoList: compact(masterWaybillNoList) };
    gridStore.setQueryParams(params);
    store.resetPageSelect();
  }, []);

  const initialValues: FormValues = useMemo(() => ({}), []);

  const [form] = Form.useForm();

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer
        onFinish={handleFinish}
        initialValues={initialValues}
        form={form}
        layout="vertical"
      >
        <Col span={7}>
          <Form.Item
            name="masterWaybillNoList"
            wrapperCol={{ span: 22 }}
            rules={numberRules}
            label={t("提单号")}
          >
            <FilterTextArea
              style={{ width: "100%", height: 75, resize: "none" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("提单列表")} wrapperClassName={styles.wrapper} table>
        <Row justify="end" style={{ padding: "0 10px" }}>
          <Button
            onClick={store.export.bind(store)}
            className="operation-btn mb-4"
            icon={<CloudUploadOutlined />}
          >
            {t("导出勾选数据")}
          </Button>
        </Row>
        <Table
          components={{ body: { cell: EditableCell } }}
          widthFit
          bordered
          loading={gridStore.loading}
          rowSelection={{
            // hideSelectAll: true,
            type: "checkbox",
            onChange: (keys) => {
              store.setSelectedRowKeys(gridStore.page, keys as string[])
            },
            selectedRowKeys: store.selectedRowKeys,
          }}
          rowKey='uid'
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

const Template = observer(PackageChangeComponent);

export default Template;

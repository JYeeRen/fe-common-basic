import { observer } from "mobx-react-lite";
import {
  Button, ClientGrid,
  Col,
  Container, EditableCell,
  FilterContainer,
  FilterTextArea,
  Form, Modal,
  Radio,
  Row, SearchSelect, Table, textareaMaxLengthRule
} from "@components";
import styles from "./prediction.module.less";
import optionsService from "@services/options.service.ts";
import { CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as PredictionConfig from "./prediction-config.tsx";
import { useStore } from "@hooks";
import { PredictionStore } from "@features/warehouse/prediction/prediction.store.ts";
import { useCallback, useEffect, useMemo } from "react";
import { compact } from "lodash";
import { WarehouseReceiptFormValues } from "@features/warehouse/prediction/type.ts";
import { PredictionUploadModal } from "@features/warehouse/prediction/prediction-upload.component.tsx";

function PredictionComponent() {
  const gridStore = ClientGrid.useGridStore(PredictionConfig.getRows, { autoLoad: false });
  const { store, t, navigate, } = useStore(PredictionStore, gridStore)(gridStore);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, tailProviderName } = values;
    gridStore.setQueryParams({ noList: compact(noList), noType, tailProviderName });
  }, []);

  const initialValues: WarehouseReceiptFormValues = useMemo(
    () => ({
      noList: [],
      noType: 0,
    }),
    []
  );

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const handleAdd = () => {
    const bigBagNoArray = store.selectedRows.map(row => row.bigBagNo);
    navigate("/warehouse/prediction/add", { state: { bigBagNoArray } });
  }

  const handleCreate = () => {
    navigate("/warehouse/prediction/create");
  };

  const handleEdit = useCallback(({ id }: { id: number }) => {
    navigate(`/warehouse/prediction/edit/${id}`)
  }, []);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: t("操作确认"),
      content: t(
        "警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作。"
      ),
      okText: t("确认删除"),
      cancelText: t("取消"),
      onOk: () => store.delete(store.selectedRowKeys),
    });
  }, []);

  const columns = useMemo(() => {
    const colDefs = PredictionConfig.getColumns({
      receiptStatusTypes: optionsService.receiptStatusTypes,
      operation: {
        edit: handleEdit,
      },
    });
    return colDefs;
  }, [optionsService.receiptStatusTypes]);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Col span={7}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {optionsService.receiptNoTypes.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item name="noList" wrapperCol={{ span: 22 }} rules={numberRules}>
            <FilterTextArea
              style={{ width: "100%", height: 75, resize: "none" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Form.Item
          name="tailProviderName"
          label={t("尾程服务商名称")}
          style={{ width: "350px" }}
        >
          <SearchSelect
            optionKey="trailProviders"
          />
        </Form.Item>
      </FilterContainer>
      <Container title={t("入库预报")} wrapperClassName={styles.wrapper} table>
        <Row justify="start" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<PlusOutlined/>}
            onClick={handleCreate}
          >
            {t("新增入库预报")}
          </Button>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<CloudDownloadOutlined/>}
            onClick={store.downloadTemplate.bind(store)}
          >
            {t("下载批量上传模板")}
          </Button>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<CloudUploadOutlined/>}
            onClick={store.showUploadModal.bind(store)}
          >
            {t("批量添加入库预报")}
          </Button>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<PlusOutlined/>}
            onClick={handleAdd}
            disabled={store.selectedRowKeys.length === 0}
          >
            {t("手动入库")}
          </Button>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<DeleteOutlined/>}
            onClick={handleDelete}
            disabled={store.selectedRowKeys.length === 0}
          >
            {t("批量删除")}
          </Button>
        </Row>
        <Table
          components={{ body: { cell: EditableCell } }}
          widthFit
          bordered
          loading={gridStore.loading}
          rowSelection={{
            hideSelectAll: false,
            type: "checkbox",
            onChange: (keys) => store.setSelectedRowKeys(keys as number[]),
            selectedRowKeys: store.selectedRowKeys,
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
          onChange={gridStore.onCommonTableChange.bind(gridStore)}
        />
      </Container>
      <PredictionUploadModal
        store={store}
        refreshTable={gridStore.loadData.bind(gridStore)}
      />
    </Container>
  );
}

const Template = observer(PredictionComponent);

export default Template;
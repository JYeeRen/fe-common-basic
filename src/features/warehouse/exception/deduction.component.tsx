import { observer } from "mobx-react-lite";
import {
  Button,
  ClientGrid,
  Col,
  ColSelector,
  Container,
  convertPredefinedRange,
  EditableCell,
  FilterContainer,
  FilterTextArea,
  Form,
  getTime,
  Modal,
  PredefinedRange,
  Radio,
  Row,
  SearchSelect,
  Table,
  textareaMaxLengthRule,
} from "@components";
import * as DeductionConfig from "./deduction-config.tsx";
import { useStore } from "@hooks";
import { DeductionStore } from "@features/warehouse/exception/deduction.store.ts";
import { useCallback, useMemo } from "react";
import { WarehouseDeductionFormValues } from "@features/warehouse/exception/type.ts";
import optionsService from "@services/options.service.ts";
import styles from "./deduction.module.less";
import { compact } from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import { DeductionModal } from "@features/warehouse/exception/deduction-modal.component.tsx";

function DeductionComponent() {
  const initialValues: WarehouseDeductionFormValues = useMemo(
    () => ({
      noList: [],
      noType: 0,
      receiptStatus: 0,
      deductionStatus: 0,
      createTime: getTime({ predefined: 31 }),
    }),
    []
  );

  const gridStore = ClientGrid.useGridStore(DeductionConfig.getRows, {
    initialValues
  });
  const { store, t } = useStore(DeductionStore, gridStore)(gridStore);

  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, receiptStatus, deductionStatus, createTime } =
      values;
    gridStore.setQueryParams({
      noList: compact(noList),
      noType,
      receiptStatus,
      deductionStatus,
      createTime: convertPredefinedRange(createTime),
    });
  }, []);

  const handleRevert = useCallback(({ id }: { id: number }) => {
    Modal.confirm({
      title: t("操作确认"),
      content: t(
        "是否确认撤销选中货物的扣货指令？确认后，将数据的扣货标记置空，并刷新当前页面的数据表格。"
      ),
      okText: t("确认撤销"),
      cancelText: t("取消"),
      onOk: () => store.cancel(id),
    });
  }, []);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const columns = useMemo(() => {
    const colDefs = DeductionConfig.getColumns({
      receiptStatusTypes: optionsService.receiptStatusTypes,
      deductionStatusTypes: optionsService.deductionStatusTypes,
      operation: {
        revert: handleRevert,
      },
    });
    return colDefs;
  }, [optionsService.receiptStatusTypes, optionsService.deductionStatusTypes]);

  const filterTemplate = [1, 2];

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Col span={7}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {optionsService.noTypes.map((opt) => {
                  if (filterTemplate.includes(opt.value as number)) {
                    return (
                      <Radio key={opt.value} value={opt.value}>
                        {opt.label}
                      </Radio>
                    );
                  }
                })}
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item
            name="noList"
            wrapperCol={{ span: 22 }}
            rules={numberRules}
          >
            <FilterTextArea
              style={{ width: "100%", height: 75, resize: "none" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="receiptStatus" label={t("货物状态")}>
            <SearchSelect optionKey="receiptStatusTypes" />
          </Form.Item>
          <Form.Item name="deductionStatus" label={t("扣货标记")}>
            <SearchSelect optionKey="deductionStatusTypes" omitKey={[1]} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="createTime"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            <PredefinedRange label={t("数据生成时间")} />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container
        title={t("扣货管理")}
        wrapperClassName={styles.wrapper}
        table
        titleExtend={<ColSelector tableKey="扣货管理" config={columns} />}
      >
        <Row justify="start" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<PlusOutlined />}
            onClick={store.showInitiateModal.bind(store)}
          >
            {t("发起新扣货指令")}
          </Button>
        </Row>
        <Table
          tableKey="扣货管理"
          components={{ body: { cell: EditableCell } }}
          widthFit
          bordered
          loading={gridStore.loading}
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
      <DeductionModal
        mainStore={store}
        refreshTable={gridStore.loadData.bind(gridStore)}
      />
    </Container>
  );
}

const Template = observer(DeductionComponent);

export default Template;

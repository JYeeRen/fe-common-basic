import { observer } from "mobx-react-lite";
import {
  ClientGrid,
  Col,
  Row,
  Container,
  FilterContainer,
  Form,
  Radio,
  SearchSelect,
  Input,
  Space,
  DatePicker,
  EditableCell,
  Table,
  Image,
  PredefinedRange,
  getTime,
  convertPredefinedRange,
} from "@components";
import * as ProblemConfig from "@features/warehouse/exception/problem-config.tsx";
import { useStore } from "@hooks";
import { useCallback, useEffect, useMemo } from "react";
import {
  ReceiptIssue,
  WarehouseProblemFormValues,
} from "@features/warehouse/exception/type.ts";
import optionsService from "@services/options.service.ts";
import { ProblemStore } from "@features/warehouse/exception/problem.store.ts";
import styles from "@features/warehouse/exception/deduction.module.less";
import { convertDate } from "@infra";
import { ProblemModalComponent } from "@features/warehouse/exception/problem-modal.component.tsx";

function ProblemComponent() {
  const initialValues: WarehouseProblemFormValues = useMemo(
    () => ({
      number: "",
      type: 0,
      receiptTime: {
        zone: "",
        start: "",
        end: "",
      },
      status: 0,
      palletCode: "",
      remark: "",
      createTime: getTime({ predefined: 7 }),
    }),
    []
  );

  const gridStore = ClientGrid.useGridStore(ProblemConfig.getRows, {
    initialValues,
    autoLoad: false,
  });
  const { store, t } = useStore(ProblemStore, gridStore)(gridStore);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  const handleFinish = useCallback((values: any = {}) => {
    const {
      number,
      type,
      status,
      palletCode,
      remark,
      receiptTimeZone,
      receiptTimeData,
      createTime,
    } = values;
    const receiptTime = {
      createTime: convertPredefinedRange(createTime),
      zone: receiptTimeZone,
      start:
        receiptTimeData && receiptTimeData.length > 0
          ? convertDate(receiptTimeData[0], receiptTimeZone).format(
              "YYYY-MM-DDTHH:mm:ssZ"
            )
          : "",
      end:
        receiptTimeData && receiptTimeData.length > 0
          ? convertDate(receiptTimeData[1], receiptTimeZone).format(
              "YYYY-MM-DDTHH:mm:ssZ"
            )
          : "",
    };
    gridStore.setQueryParams({
      number,
      type,
      status,
      palletCode,
      remark,
      receiptTime,
    });
  }, []);

  const handleShow = useCallback(async (value: ReceiptIssue) => {
    const res = await store.getImageUrl({ id: value.id });
    store.imageUrl = res.url;
    store.setImageVisible(true);
  }, []);

  const handleLink = useCallback((value: ReceiptIssue) => {
    store.showProblemLinkModal(value);
  }, []);

  const columns = useMemo(() => {
    const colDefs = ProblemConfig.getColumns({
      receiptStatusTypes: optionsService.receiptStatusTypes,
      receiptIssueStatusTypes: optionsService.receiptIssueStatusTypes,
      operation: {
        showPic: handleShow,
        link: handleLink,
      },
    });
    return colDefs;
  }, [
    optionsService.receiptStatusTypes,
    optionsService.receiptIssueStatusTypes,
  ]);

  const filterTemplate = [1, 2];

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Col>
          <Row style={{ paddingBottom: "8px" }}>
            <div>
              <Form.Item noStyle name="type">
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
            <Form.Item name="number" style={{ width: "300px" }}>
              <Input />
            </Form.Item>
            <Form.Item
              label={t("入库时间")}
              labelAlign="right"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 10 }}
            >
              <Space.Compact>
                <Form.Item name="receiptTimeZone" noStyle>
                  <SearchSelect
                    optionKey="timeZones"
                    placeholder={t("选择时区")}
                    style={{ width: "200px" }}
                  />
                </Form.Item>
                <Form.Item name="receiptTimeData" noStyle>
                  <DatePicker.RangePicker
                    showTime
                    style={{ width: "300px" }}
                    placeholder={[t("开始日期时间"), t("结束日期时间")]}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              name="status"
              label={t("处理状态")}
              style={{ width: "300px" }}
            >
              <SearchSelect optionKey="receiptIssueStatusTypes" />
            </Form.Item>
            <Form.Item
              name="palletCode"
              label={t("托盘码")}
              style={{ width: "300px" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="remark"
              label={t("备注")}
              style={{ width: "300px" }}
            >
              <Input />
            </Form.Item>
          </Row>
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
        title={t("问题件管理")}
        wrapperClassName={styles.wrapper}
        table
      >
        <Table
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
      <ProblemModalComponent
        mainStore={store}
        refreshTable={gridStore.loadData.bind(gridStore)}
      />
      <Image
        width={200}
        height={200}
        style={{ display: "none" }}
        src={store.imageUrl}
        fallback="data:image/png;base64,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"
        preview={{
          visible: store.imageVisible,
          src: store.imageUrl,
          onVisibleChange: (value) => store.setImageVisible(value),
        }}
      />
    </Container>
  );
}

const Template = observer(ProblemComponent);

export default Template;

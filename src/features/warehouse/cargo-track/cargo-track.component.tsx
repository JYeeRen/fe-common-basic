import {
  ClientGrid,
  Col,
  Row,
  Container,
  EditableCell,
  FilterContainer,
  FilterTextArea,
  Form,
  Radio,
  SearchSelect,
  Table,
  textareaMaxLengthRule,
  Space,
  DatePicker,
  Button,
  Image,
  ColSelector,
  PredefinedRange,
  convertPredefinedRange,
  getTime,
} from "@components";
import styles from "./cargo-track.module.less";
import optionsService from "@services/options.service.ts";
import * as CargoTrackConfig from "./cargo-track-config.tsx";
import { useStore } from "@hooks";
import { useCallback, useEffect, useMemo } from "react";
import { compact } from "lodash";
import {
  CargoTrack,
  WarehouseCargoTrackFormValues,
} from "@features/warehouse/prediction/type.ts";
import { observer } from "mobx-react-lite";
import { CargoTrackStore } from "@features/warehouse/cargo-track/cargo-track.store.ts";
import { convertDate } from "@infra";
import { CloudDownloadOutlined } from "@ant-design/icons";

function CargoTrackComponent() {
  const initialValues: WarehouseCargoTrackFormValues = useMemo(
    () => ({
      createTime: getTime({ predefined: 7 }),
      noList: [],
      noType: 0,
      receiptStatus: 0,
      deductionStatus: 0,
      receiptTime: {
        zone: "",
        start: "",
        end: "",
      },
      outboundTime: {
        zone: "",
        start: "",
        end: "",
      },
    }),
    []
  );

  const gridStore = ClientGrid.useGridStore(CargoTrackConfig.getRows, {
    initialValues,
    autoLoad: false,
  });
  const { store, t } = useStore(CargoTrackStore, gridStore)(gridStore);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  const handleFinish = useCallback((values: any = {}) => {
    const {
      noList,
      noType,
      receiptStatus,
      deductionStatus,
      receiptTimeZone,
      receiptTimeData,
      outboundTimeZone,
      outboundTimeData,
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

    const outboundTime = {
      zone: outboundTimeZone,
      start:
        outboundTimeData && outboundTimeData.length > 0
          ? convertDate(outboundTimeData[0], outboundTimeZone).format(
              "YYYY-MM-DDTHH:mm:ssZ"
            )
          : "",
      end:
        outboundTimeData && outboundTimeData.length > 0
          ? convertDate(outboundTimeData[1], outboundTimeZone).format(
              "YYYY-MM-DDTHH:mm:ssZ"
            )
          : "",
    };

    gridStore.setQueryParams({
      noList: compact(noList),
      noType,
      receiptStatus,
      deductionStatus,
      receiptTime,
      outboundTime,
    });
  }, []);

  const handleShow = useCallback(async (value: CargoTrack) => {
    const res = await store.getImageUrl({ id: value.id });
    store.imageUrl = res.url;
    store.setImageVisible(true);
  }, []);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const columns = useMemo(() => {
    const colDefs = CargoTrackConfig.getColumns({
      receiptStatusTypes: optionsService.receiptStatusTypes,
      deductionStatusTypes: optionsService.deductionStatusTypes,
      operation: {
        showPic: handleShow,
      },
    });
    return colDefs;
  }, [optionsService.receiptStatusTypes, optionsService.deductionStatusTypes]);

  const filterTemplate = [1, 2, 6];

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
          <Row justify="center">
            <Form.Item
              name="receiptStatus"
              label={t("货物状态")}
              style={{ paddingRight: "8px" }}
            >
              <SearchSelect
                optionKey="receiptStatusTypes"
                style={{ width: "150px" }}
              />
            </Form.Item>
            <Form.Item name="deductionStatus" label={t("扣货标记")}>
              <SearchSelect
                optionKey="deductionStatusTypes"
                style={{ width: "150px" }}
              />
            </Form.Item>
          </Row>
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
          <Form.Item
            label={t("出库时间")}
            labelAlign="right"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10 }}
          >
            <Space.Compact>
              <Form.Item name="outboundTimeZone" noStyle>
                <SearchSelect
                  optionKey="timeZones"
                  placeholder={t("选择时区")}
                  style={{ width: "200px" }}
                />
              </Form.Item>
              <Form.Item name="outboundTimeData" noStyle>
                <DatePicker.RangePicker
                  showTime
                  style={{ width: "300px" }}
                  placeholder={[t("开始日期时间"), t("结束日期时间")]}
                />
              </Form.Item>
            </Space.Compact>
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
        title={t("货物查询")}
        wrapperClassName={styles.wrapper}
        table
        titleExtend={<ColSelector tableKey="货物查询" config={columns} />}
      >
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
          tableKey="货物查询"
          components={{ body: { cell: EditableCell } }}
          widthFit
          bordered
          loading={gridStore.loading}
          // rowSelection={{
          //     hideSelectAll: true,
          //     type: "checkbox",
          //     onChange: (keys) => store.setSelectedRowKeys(keys as number[]),
          //     selectedRowKeys: store.selectedRowKeys,
          // }}
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

const Template = observer(CargoTrackComponent);

export default Template;

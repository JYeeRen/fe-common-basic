import {
  Button,
  ClientGrid,
  Col,
  Container,
  DatePicker,
  FilterContainer,
  FilterTextArea,
  Form,
  Modal,
  Radio,
  RadioGroupProps,
  Row,
  SearchSelect,
  Space,
  Table,
  EditableCell,
  textareaMaxLengthRule,
  PredefinedRange,
  convertPredefinedRange,
  getTime,
} from "@components";
import { observer } from "mobx-react-lite";
import * as declareStatusConfig from "./declare-status-config";
import styles from "./declare-status.module.less";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "@hooks";
import { BillOfLadingStore } from "./declare-status.store";
import { CustomsStatus, CustomsStatusFormValues } from "./type";
import {
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import optionsService from "@services/options.service";
import { useTranslation } from "@locale";
import { compact } from "lodash";
import dayjs from "dayjs";

function QuickDatePicker(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: RadioGroupProps & { onChange?: (value: any) => void }
) {
  const { value, onChange, ...restProps } = props;

  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleRadioClick = (val: unknown) => {
    if (value === val) {
      setValue(undefined);
      onChange?.(undefined);
    } else {
      setValue(val);
      onChange?.(val);
    }
  };

  const [t] = useTranslation();

  return (
    <Radio.Group {...restProps} value={_value}>
      <Radio.Button
        onClick={() => handleRadioClick("yeaterday")}
        value="yeaterday"
      >
        {t("昨天")}
      </Radio.Button>
      <Radio.Button onClick={() => handleRadioClick("today")} value="today">
        {t("当天")}
      </Radio.Button>
      <Radio.Button
        onClick={() => handleRadioClick("threeday")}
        value="threeday"
      >
        {t("3天内")}
      </Radio.Button>
    </Radio.Group>
  );
}

function DeclareStatusComponent() {

  const initialValues: CustomsStatusFormValues = useMemo(
    () => ({
      noType: 0,
      days: "today",
      createTime: getTime({ predefined: 7 })
    }),
    []
  );

  const gridStore = ClientGrid.useGridStore(declareStatusConfig.getRows, {
    initialValues,
    autoLoad: false,
  });
  const { store, t, navigate } = useStore(
    BillOfLadingStore,
    gridStore
  )(gridStore);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  useEffect(() => {
    if (store.warning) {
      Modal.warning({
        title: t("警告！"),
        content: t(
          "有单号处于货物已起飞，但相关清关预报资料未完成状态，请注意及时查看！"
        ),
        okText: t("去查看"),
        icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
        okButtonProps: { danger: true },
        onOk: () => store.setWarning(false),
      });
    }
  }, [store.warning]);

  const columns = useMemo(() => {
    const colDefs = declareStatusConfig.getColumns({
      customsStatusTypes: optionsService.customsStatusTypes,
      onRemarkSave: store.editRemark.bind(store),
    });
    return colDefs.filter((col) => {
      const noType = gridStore.params.noType ?? 0;
      return col.key !== "bigBagNo" || noType !== 0;
    });
  }, [gridStore.params.noType, optionsService.customsStatusTypes]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const {
      dateRange,
      noList,
      noType,
      customsStatusType,
      flightDate,
      flightDateTZ,
      quickDate,
      createTime
    } = values;
    const params = {
      noList: compact(noList),
      noType,
      uploadDate: {
        start: dateRange?.[0].format(),
        end: dateRange?.[1].format(),
      },
      flightDate: {
        zone: flightDateTZ,
        start: flightDate?.[0].format(),
        end: flightDate?.[1].format(),
      },
      customsStatusType,
      createTime: convertPredefinedRange(createTime),
    };
    if (quickDate === "today") {
      params.uploadDate.start = dayjs().startOf("day").format();
      params.uploadDate.end = dayjs().endOf("day").format();
    }
    if (quickDate === "yeaterday") {
      params.uploadDate.start = dayjs()
        .subtract(1, "day")
        .startOf("day")
        .format();
      params.uploadDate.end = dayjs().subtract(1, "day").endOf("day").format();
    }
    if (quickDate === "threeday") {
      params.uploadDate.start = dayjs()
        .subtract(3, "day")
        .startOf("day")
        .format();
      params.uploadDate.end = dayjs().endOf("day").format();
    }
    gridStore.setQueryParams(params);
  }, []);

  const tableClassName = useCallback(
    (record: CustomsStatus) => (record.warning ? styles.warining : ""),
    []
  );

  const handleCreateDocument = useCallback(async () => {
    await store.createDocument();
    Modal.confirm({
      title: t("操作确认"),
      content: t("已发起关务任务，是否现在去制作清关单证？"),
      okText: t("制作清关单证"),
      cancelText: t("留在当前页面"),
      onOk: () => navigate("/customs/declaration"),
      onCancel: () => store.gridStore.loadData(),
    });
  }, []);

  const [form] = Form.useForm();

  const handleQuickDateChange = () => {
    form.setFieldValue("dateRange", undefined);
  };
  const handleDatePickerChange = () => {
    form.setFieldValue("quickDate", undefined);
  };

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer
        onFinish={handleFinish}
        initialValues={initialValues}
        form={form}
      >
        <Col span={7}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {optionsService.customsStatusNoTypes.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
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
        <Col span={16}>
          <Row justify="start">
            <Col span={24}>
              <Form.Item
                label={t("客户上传时间")}
                labelAlign="left"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Form.Item name="quickDate" noStyle>
                  <QuickDatePicker
                    optionType="button"
                    onChange={handleQuickDateChange}
                  />
                </Form.Item>
                <Form.Item name="dateRange" noStyle>
                  <DatePicker.RangePicker onChange={handleDatePickerChange} />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={15}>
              <Form.Item
                label={t("航班时间")}
                labelAlign="left"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
              >
                <Space.Compact>
                  <Form.Item name="flightDateTZ" noStyle>
                    <SearchSelect
                      optionKey="timeZones"
                      placeholder={t("请选择时区")}
                      style={{ width: "40%" }}
                    />
                  </Form.Item>
                  <Form.Item name="flightDate" noStyle>
                    <DatePicker.RangePicker style={{ width: "60%" }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                label={t("关务状态")}
                name="customsStatusType"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 12 }}
              >
                <SearchSelect optionKey="customsStatusTypes" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Form.Item name="createTime" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            <PredefinedRange label={t("数据生成时间")} />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("提单列表")} wrapperClassName={styles.wrapper} table>
        <Row justify="space-between" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mb-4"
            icon={<UploadOutlined />}
            disabled={store.initiateDisabled}
            onClick={handleCreateDocument}
          >
            {t("发起关务任务")}
          </Button>
          <Button
            onClick={store.export.bind(store)}
            className="operation-btn"
            icon={<CloudUploadOutlined />}
          >
            {t("导出已筛选商品信息")}
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
            getCheckboxProps: (record) => {
              let disabled = false;
              if (!record.masterWaybillNo && record.bigBagNo) {
                disabled = true;
              }
              if (record.customsStatus !== 1) {
                disabled = true;
              }
              return { disabled };
            },
          }}
          rowKey="id"
          dataSource={gridStore.rowData}
          columns={columns}
          size="small"
          rowClassName={tableClassName}
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

const Template = observer(DeclareStatusComponent);

export default Template;

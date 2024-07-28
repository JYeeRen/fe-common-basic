import {
  Button,
  ClientGrid,
  Col,
  Container,
  DatePicker,
  EditableCell,
  FilterContainer,
  FilterTextArea,
  Form,
  Input,
  QuickDatePicker,
  Row,
  Table,
  TableColSettings,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore.hook";
import { Store } from "./waybill-statistics.store";
import * as config from "./waybill-statistics-config";
import styles from "./template-list.module.less";
import { CloudDownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { dayjs } from "@infra";
import { compact } from "lodash";
import { R } from "./waybill-statistics.types";

function WaybillStatisticsComponent() {
  const { store, t } = useStore(Store)();
  const gridStore = ClientGrid.useGridStore<R>(config.getRows);

  const setPmc = async (id: number, pmc: string) => {
    await store.setPmc(id, pmc);
    gridStore.loadData();
  };

  const columns = [...config.getColumns(setPmc), ...store.dynamicCols];

  const onFinish = (values: any) => {
    const {
      masterWaybillNoList,
      dateRange,
      flightNumber,
      quickDate,
      portCode,
      tailProviderName,
    } = values;
    const params = {
      flightNumber,
      masterWaybillNoList: compact(masterWaybillNoList),
      ata: {
        // zone: flightDateTZ,
        start: dateRange?.[0].format(),
        end: dateRange?.[1].format(),
      },
      portCode,
      tailProviderName,
    };
    if (quickDate === "today") {
      params.ata.start = dayjs().startOf("day").format();
      params.ata.end = dayjs().endOf("day").format();
    }
    if (quickDate === "yeaterday") {
      params.ata.start = dayjs().subtract(1, "day").startOf("day").format();
      params.ata.end = dayjs().subtract(1, "day").endOf("day").format();
    }
    if (quickDate === "threeday") {
      params.ata.start = dayjs().subtract(3, "day").startOf("day").format();
      params.ata.end = dayjs().endOf("day").format();
    }
    gridStore.setQueryParams(params);
  };

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const [form] = Form.useForm();

  const handleQuickDateChange = () => {
    form.setFieldValue("dateRange", undefined);
  };
  const handleDatePickerChange = () => {
    form.setFieldValue("quickDate", undefined);
  };

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer
        form={form}
        initialValues={{}}
        onFinish={onFinish}
        layout="vertical"
      >
        <Col span={10}>
          <Form.Item
            name="masterWaybillNoList"
            label={<span style={{ height: "30px" }}>{t("提单号")}</span>}
            wrapperCol={{ span: 22 }}
            rules={numberRules}
          >
            <FilterTextArea
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Row justify="start">
            <Col span={24}>
              <Form.Item
                label={t("ATA")}
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
            <Col span={12}>
              <Form.Item
                name="portCode"
                label={t("落地港口2")}
                wrapperCol={{ span: 22 }}
              >
                <Input allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="flightNumber"
                label={t("航班号2")}
                wrapperCol={{ span: 22 }}
              >
                <Input allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </FilterContainer>
      <Container
        title={t("提单数据统计")}
        wrapperClassName={styles.wrapper}
        table
      >
        <Row justify="space-between" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<FilterOutlined />}
            onClick={store.showSetting.bind(store)}
          >
            {t("设置尾程服务商")}
          </Button>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<CloudDownloadOutlined />}
            onClick={store.export.bind(store, gridStore.queryParams as any)}
          >
            {t("导出已筛选数据")}
          </Button>
        </Row>
        <Table
          components={{ body: { cell: EditableCell } }}
          widthFit
          bordered
          loading={gridStore.loading}
          rowSelection={{ type: "checkbox" }}
          rowKey="id"
          dataSource={gridStore.rowData}
          columns={columns}
          size="small"
          onChange={gridStore.onCommonTableChange.bind(gridStore)}
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
      {store.settingVisible && (
        <TableColSettings
          onClose={store.hideSetting.bind(store)}
          fieldColumns={store.setting}
          visible={store.settingVisible}
          setShowColumns={store.setSetting.bind(store)}
          selectedKeys={store.selectedCols}
        />
      )}
    </Container>
  );
}

const WaybillStatistics = observer(WaybillStatisticsComponent);

export default WaybillStatistics;

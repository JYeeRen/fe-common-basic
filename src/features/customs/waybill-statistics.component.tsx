import {
  Button,
  ClientGrid,
  Col,
  Container,
  convertPredefinedRange,
  DatePicker,
  EditableCell,
  FilterContainer,
  FilterTextArea,
  Form,
  getTime,
  Input,
  PredefinedRange,
  QuickDatePicker,
  Row,
  Table,
  TableColSettings,
  TableSummary,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore.hook";
import { Store } from "./waybill-statistics.store";
import * as config from "./waybill-statistics-config";
import styles from "./template-list.module.less";
import {
  CloudDownloadOutlined,
  FilterOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import { dayjs } from "@infra";
import { compact, get, sumBy } from "lodash";
import { R } from "./waybill-statistics.types";
import type { WaybillStatistics } from "./waybill-statistics.types";
import { WaybillStatisticsBOLModal } from "./waybill-statistics.bol.modal";

function WaybillStatisticsComponent() {
  const { store, t } = useStore(Store)();

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const initialValues = useMemo(
    () => ({
      createTime: getTime({ predefined: 7 }),
    }),
    []
  );

  const gridStore = ClientGrid.useGridStore<R>(config.getRows, {
    initialValues,
  });

  const setPmc = async (id: number, pmc: string) => {
    await store.setPmc(id, pmc);
    gridStore.loadData();
  };

  const columns = [...config.getColumns(setPmc), ...store.dynamicCols];

  const [pagination, setPagination] = useState(true);

  const onFinish = (values: any) => {
    const {
      masterWaybillNoList,
      dateRange,
      flightNumber,
      quickDate,
      portCode,
      tailProviderName,
      createTime,
    } = values;
    const params = {
      createTime: convertPredefinedRange(createTime),
      flightNumber,
      masterWaybillNoList: compact(masterWaybillNoList).length > 0 ? compact(masterWaybillNoList) : undefined,
      ata: dateRange?.length > 0 ? {
        // zone: flightDateTZ,
        start: dateRange?.[0].format(),
        end: dateRange?.[1].format(),
      } : undefined,
      portCode,
      tailProviderName,
    };
    if (quickDate === "today" && params.ata) {
      params.ata.start = dayjs().startOf("day").format();
      params.ata.end = dayjs().endOf("day").format();
    }
    if (quickDate === "yeaterday" && params.ata) {
      params.ata.start = dayjs().subtract(1, "day").startOf("day").format();
      params.ata.end = dayjs().subtract(1, "day").endOf("day").format();
    }
    if (quickDate === "threeday" && params.ata) {
      params.ata.start = dayjs().subtract(3, "day").startOf("day").format();
      params.ata.end = dayjs().endOf("day").format();
    }
    gridStore.setQueryParams(params);
    setPagination(compact(masterWaybillNoList).length === 0);
    setSelectedRowKeys([]);
  };

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const [form] = Form.useForm();

  const handleQuickDateChange = () => {
    form.setFieldValue("dateRange", undefined);
  };
  const handleDatePickerChange = () => {
    form.setFieldValue("quickDate", undefined);
  };

  const summaryRender = useCallback(
    (pageData: readonly WaybillStatistics[]) => {
      if (pagination) {
        return undefined;
      }

      if (store.dynamicCols.length === 0) {
        return undefined;
      }

      const dynamicCells = store.dynamicCols.map((col, index) => {
        const val = sumBy(pageData, (row) =>
          Number(get(row, (col as any).dataIndex) ?? "")
        );
        return (
          <TableSummary.Cell key={col.key} index={6 + index}>
            {val}
          </TableSummary.Cell>
        );
      });
      return (
        <TableSummary fixed>
          <TableSummary.Row style={{ backgroundColor: "#ffff006e" }}>
            <TableSummary.Cell index={0}></TableSummary.Cell>
            <TableSummary.Cell index={1}></TableSummary.Cell>
            <TableSummary.Cell index={2}></TableSummary.Cell>
            <TableSummary.Cell index={3}></TableSummary.Cell>
            <TableSummary.Cell index={4}></TableSummary.Cell>
            <TableSummary.Cell index={5}></TableSummary.Cell>
            {dynamicCells}
          </TableSummary.Row>
        </TableSummary>
      );
    },
    [pagination]
  );

  return (
    <Container className={styles.container} loading={store.loading}>
      <WaybillStatisticsBOLModal
        loading={store.loading}
        open={store.bolVisible}
        onConfirm={store.downloadBOL.bind(store)}
        onCancel={store.hideBOL.bind(store)}
        rows={compact(
          selectedRowKeys.map((id) =>
            gridStore.rowData.find((row) => row.id === id)
          )
        )}
      />
      <FilterContainer
        form={form}
        initialValues={initialValues}
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
                  <DatePicker.RangePicker needConfirm={false} onChange={handleDatePickerChange} />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* <Col span={12}>
              <Form.Item
                name="portCode"
                label={t("落地港口2")}
                wrapperCol={{ span: 22 }}
              >
                <Input allowClear />
              </Form.Item>
            </Col> */}
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
        <Col span={24}>
          <Form.Item
            name="createTime"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            <PredefinedRange needConfirm={false} label={t("数据生成时间")} />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container
        title={t("提单数据统计")}
        wrapperClassName={styles.wrapper}
        table
      >
        <Row justify="space-between" style={{ padding: "0 10px" }}>
          <span>
            <Button
              className="operation-btn mr-4 mb-4"
              icon={<FilterOutlined />}
              onClick={store.showSetting.bind(store)}
            >
              {t("设置尾程服务商")}
            </Button>
            <Button
              className="operation-btn mr-4 mb-4"
              icon={<PrinterOutlined />}
              onClick={store.showBOL.bind(store)}
              disabled={selectedRowKeys.length === 0}
            >
              {t("生成BOL")}
            </Button>
          </span>
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
          useColWidth
          bordered
          minHeight={30}
          loading={gridStore.loading}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (selected) => setSelectedRowKeys(selected as number[]),
          }}
          rowKey="id"
          dataSource={gridStore.rowData}
          columns={columns}
          size="small"
          onChange={gridStore.onCommonTableChange.bind(gridStore)}
          pagination={
            pagination && {
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
            }
          }
          summary={summaryRender}
        />
      </Container>
      {store.settingVisible && (
        <TableColSettings
          loading={store.loading}
          saveShort
          onClose={store.hideSetting.bind(store)}
          fieldColumns={store.setting}
          visible={store.settingVisible}
          setShowColumns={async (keys, short) => {
            const newKeys = keys.filter((k) => store.settingDict[k]);
            const providerNames = newKeys.map(
              (k) => store.settingDict[k].label
            );
            const newOthers = { ...short?.shorts } as Record<string, number[]>;
            if (short?.name) {
              newOthers[short.name] = newKeys as number[];
            }
            const provider = {
              ...store.provider,
              name: short?.name ?? "",
              ids: newKeys.map((k) => Number(k)),
              others: newOthers,
            };
            await store.setSetting(providerNames, provider);
            await store.getSetting();
            await gridStore.loadData();
          }}
          selectedKeys={store.provider.ids}
          shortName={store.provider.name}
          shorts={store.provider.others}
          onShortClose={async (name) => {
            const newOthers = { ...store.provider.others };
            delete newOthers[name];
            const providerNames = store.provider.ids.map(
              (k) => store.settingDict[k].label
            );
            await store.setSetting(providerNames, {
              ...store.provider,
              name: store.provider.name,
              ids: store.provider.ids,
              others: newOthers,
            });
            await store.getSetting();
          }}
        />
      )}
    </Container>
  );
}

const WaybillStatistics = observer(WaybillStatisticsComponent);

export default WaybillStatistics;

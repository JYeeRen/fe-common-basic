import {
  Button,
  ClientGrid,
  Col,
  Container,
  DatePicker,
  FilterContainer,
  FilterTextArea,
  Form,
  Radio,
  Row,
  SearchSelect,
  Space,
  Table,
} from "@components";
import { observer } from "mobx-react-lite";
import * as declareStatusConfig from "./declare-status-config";
import styles from "./declare-status.module.less";
import { useCallback, useMemo } from "react";
import { useStore } from "@hooks";
import { BillOfLadingStore } from "./declare-status.store";
import { CustomsStatusFormValues } from "./type";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import optionsService from "@services/options.service";

function DeclareStatusComponent() {
  const { store, t } = useStore(BillOfLadingStore)();
  const gridStore = ClientGrid.useGridStore(declareStatusConfig.getRows);

  const columns = useMemo(() => {
    const colDefs = declareStatusConfig.getColumns();
    return colDefs.filter((col) => {
      const noType = gridStore.params.noType ?? 0;
      return col.key !== "bigBagNo" || noType !== 0;
    });
  }, [gridStore.params.noType]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, customsStatusType } = values;
    console.log(values);
    gridStore.setQueryParams({
      noList: noList || undefined,
      noType: noType || undefined,
      customsStatusType: customsStatusType || undefined,
    });
  }, []);

  const initialValues: CustomsStatusFormValues = useMemo(
    () => ({
      noType: 0,
      days: "today",
    }),
    []
  );

  const noTypeOptions = useMemo(
    () => optionsService.get("customsStatusNoTypes"),
    [optionsService.data.customTemplateTypes]
  );

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Col span={10}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {noTypeOptions.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item name="productName">
            <FilterTextArea
              style={{ width: "100%", height: 75, resize: "none" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Row justify="start">
            <Col span={24}>
              <Form.Item
                label={t("客户上传时间")}
                labelAlign="left"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Form.Item name="days" noStyle>
                  <Radio.Group>
                    <Radio.Button value="yeaterday">{t("昨天")}</Radio.Button>
                    <Radio.Button value="today">{t("当天")}</Radio.Button>
                    <Radio.Button value="threeday">{t("3天内")}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="dateRange" noStyle>
                  <DatePicker.RangePicker />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item
                label={t("航班时间")}
                labelAlign="left"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Space.Compact>
                  <Form.Item name="flightDateTZ" noStyle>
                    <SearchSelect
                      optionKey="timeZones"
                      placeholder={t("请选择时区")}
                      style={{ width: "180px" }}
                    />
                  </Form.Item>
                  <Form.Item name="flightDate" noStyle>
                    <DatePicker.RangePicker />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label={t("关务状态")} name="customsStatusType">
                <SearchSelect optionKey="customsStatusTypes" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </FilterContainer>
      <Container title={t("提单列表")} wrapperClassName={styles.wrapper}>
        <Row justify="space-between" style={{ padding: "0 10px" }}>
          <Button className="operation-btn mb-4" icon={<UploadOutlined />}>
            {t("发起关务任务")}
          </Button>
          <Button className="operation-btn" icon={<CloudUploadOutlined />}>
            {t("导出已筛选商品信息")}
          </Button>
        </Row>
        <Table
          widthFit
          bordered
          loading={gridStore.loading}
          rowSelection={{ type: "checkbox" }}
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

const Template = observer(DeclareStatusComponent);

export default Template;

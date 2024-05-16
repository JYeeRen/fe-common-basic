import {
  Button,
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  Row,
  Form,
  SearchSelect,
  Table,
  textareaMaxLengthRule,
  FilterTextArea,
  Input,
  Space,
  DatePicker,
} from "@components";
import { observer } from "mobx-react-lite";
import * as BillOfLadingConfig from "./bill-of-lading-config";
import styles from "./bill-of-lading.module.less";
import { useCallback, useMemo } from "react";
import { useStore } from "@hooks";
import { BillOfLadingStore } from "./bill-of-lading.store";
import { FormValues } from "./type";
import { PlusOutlined } from "@ant-design/icons";

function TrackTraceComponent() {
  const { store, t } = useStore(BillOfLadingStore)();
  const gridStore = ClientGrid.useGridStore(BillOfLadingConfig.getRows);
  const columns = useMemo(() => BillOfLadingConfig.getColumns(), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, customsStatusType } = values;
    gridStore.setQueryParams({
      noList: noList || undefined,
      noType: noType || undefined,
      customsStatusType: customsStatusType || undefined,
    });
  }, []);

  const initialValues: FormValues = useMemo(() => ({}), []);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer
        onFinish={handleFinish}
        // layout="vertical"
        initialValues={initialValues}
      >
        <Col span={10}>
          <Row>
            <div style={{ paddingBottom: "8px" }}>
              <Form.Item noStyle>
                <span style={{ height: "30px" }}>{t("提单号")}</span>
              </Form.Item>
            </div>
            <Form.Item
              style={{ width: "100%" }}
              name="noList"
              wrapperCol={{ span: 22 }}
              rules={numberRules}
            >
              <FilterTextArea
                style={{ width: "100%", height: 75, resize: "none" }}
                placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
              />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 17 }}
              labelAlign="left"
              style={{ width: "100%" }}
              name="departPortCode"
              label={t("起飞港口")}
            >
              <Input />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 17 }}
              labelAlign="left"
              style={{ width: "100%" }}
              name="arrivePortCode"
              label={t("落地港口")}
            >
              <Input />
            </Form.Item>
          </Row>
        </Col>
        <Col span={14}>
          <Row>
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
          </Row>
          <Row>
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
          </Row>
          <Row>
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
          </Row>
          <Row>
            <Form.Item
              label={t("ATD")}
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
          </Row>
          <Row>
            <Form.Item
              label={t("ATA")}
              labelAlign="left"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
            >
              <Space.Compact>
                <Form.Item name="ata" noStyle>
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
          </Row>
        </Col>
      </FilterContainer>
      <Container title={t("航空信息")} wrapperClassName={styles.wrapper}>
        <Row justify="start" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<PlusOutlined />}
            // onClick={store.toogleModalVisible.bind(store)}
          >
            {t("包裹信息录入")}
          </Button>
        </Row>
        <Table
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

const Template = observer(TrackTraceComponent);

export default Template;

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
  getTime, Modal,
} from "@components";
import styles from "./cargo-track.module.less";
import optionsService from "@services/options.service.ts";
import * as CargoTrackConfig from "./cargo-track-config.tsx";
import { useStore } from "@hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [ImgVisible, setImgVisible] = useState(false);
  const [ImgUrl, setImgUrl] = useState<string[]>([]);

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
      tailProviderName,
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
      tailProviderName,
    });
  }, []);

  const handleShow = useCallback(async (value: CargoTrack) => {
    const res = await store.getImageUrl({ id: value.id });
    setImgUrl(res.urlList);
    setImgVisible(true);
  }, []);

  const handleCancel = () => setImgVisible(false);

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
            name="tailProviderName"
            label={t("尾程服务商名称")}
          >
            <SearchSelect
              optionKey="trailProviders"
            />
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
            <PredefinedRange label={t("数据生成时间")}/>
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container
        title={t("货物查询")}
        wrapperClassName={styles.wrapper}
        table
        titleExtend={<ColSelector tableKey="货物查询" config={columns}/>}
      >
        <Row justify="end" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<CloudDownloadOutlined/>}
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
      <Modal
        onCancel={handleCancel}
        title={t("图片查看")}
        footer={null}
        visible={ImgVisible}
      >
        <div className={styles.prevImgContainer}>
          <Image.PreviewGroup
            preview={{
              onVisibleChange: (value: boolean) => {
                if (value == false) {
                  setImgVisible(true);
                }
              },
            }}
          >
            {ImgUrl.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt=""
                width={100}
                height={100}
                className={styles.prevImg}
                onClick={() => setImgVisible(false)}
              />
            ))}
          </Image.PreviewGroup>
        </div>
      </Modal>
    </Container>
  );
}

const Template = observer(CargoTrackComponent);

export default Template;

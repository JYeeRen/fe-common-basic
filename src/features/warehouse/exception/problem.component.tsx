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
  convertPredefinedRange, Modal,
} from "@components";
import * as ProblemConfig from "@features/warehouse/exception/problem-config.tsx";
import { useStore } from "@hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [ImgVisible, setImgVisible] = useState(false);
  const [ImgUrl, setImgUrl] = useState<string[]>([]);

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
    gridStore.setQueryParams({
      number,
      type,
      status,
      palletCode,
      remark,
      receiptTime,
      tailProviderName,
    });
  }, []);

  const handleShow = useCallback(async (value: ReceiptIssue) => {
    const res = await store.getImageUrl({ id: value.id });
    setImgUrl(res.urlList);
    setImgVisible(true);
  }, []);

  const handleCancel = () => setImgVisible(false);

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
        <Col span={24}>
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
              <Input/>
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
              <SearchSelect optionKey="receiptIssueStatusTypes"/>
            </Form.Item>
            <Form.Item
              name="palletCode"
              label={t("托盘码")}
              style={{ width: "300px" }}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="remark"
              label={t("备注")}
              style={{ width: "300px" }}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="tailProviderName"
              label={t("尾程服务商名称")}
              style={{ width: "350px" }}
            >
              <SearchSelect
                optionKey="trailProviders"
              />
            </Form.Item>
          </Row>
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

const Template = observer(ProblemComponent);

export default Template;

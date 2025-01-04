import { observer } from "mobx-react-lite";
import { useStore } from "@hooks";
import {
  Button,
  ClientGrid,
  Col,
  ColSelector,
  Container,
  convertPredefinedRange,
  FilterContainer,
  FilterTextArea,
  Form,
  getTime,
  Input,
  PredefinedRange,
  Row,
  SearchSelect,
  Table,
  textareaMaxLengthRule
} from "@components";
import { ClearanceOfGoodsStore } from "./clearance-of-goods.store";
import * as CustomItemConfig from "./clearance-of-goods.config";
import styles from "./clerance-of-goods.module.less";
import { CloudDownloadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useCallback, useMemo } from "react";
import { CustomITemsQueryParams } from "./types";
import { compact } from "lodash";
import { uploadCols } from "./clearance-of-goods.upload-cols";
import i18next from "i18next";
import { UploadModal } from "./clearance-of-goods.upload";

function ClearanceOfGoodsComponent() {
  const { t, store } = useStore(ClearanceOfGoodsStore)();

  const initialValues = { otherType: 0, createTime: getTime({ predefined: 7 }) };

  const gridStore = ClientGrid.useGridStore(CustomItemConfig.getRows, { initialValues });

  const columns = useMemo(() => CustomItemConfig.getGridColumns(), []);

  const handleFinish = (values?: CustomITemsQueryParams) => {
    const {
      customerName,
      masterWaybillNoList,
      bigBagNoList,
      otherType,
      otherList,
      createTime,
    } = values || {};
    gridStore.setQueryParams({
      createTime: convertPredefinedRange(createTime),
      customerName,
      masterWaybillNoList: masterWaybillNoList && compact(masterWaybillNoList),
      bigBagNoList: bigBagNoList && compact(bigBagNoList),
      otherList: otherList && compact(otherList),
      otherType,
    });
  };

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExportQuery = useCallback(
    () => store.export(gridStore.params as any),
    [gridStore.params, store]
  );
  const handleExportAll = useCallback(() => store.export(), [store]);

  return (
    <Container className={styles.container} loading={store.loading}>
      <UploadModal
        loading={store.loading}
        open={store.uploadVisible}
        title={t("批量上传")}
        onDownload={store.downLoadTemplate.bind(store)}
        onClose={store.hideUploadModal.bind(store)}
        onUpload={store.upload.bind(store)}
        tableHeaders={uploadCols.map(c => (c as any)[i18next.language])}
      />
      <FilterContainer
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 20 }}
        rowExtend={{ style: { alignItems: "flex-start" } }}
      >
        <Col span={6}>
          <Form.Item
            name="masterWaybillNoList"
            label={<span style={{ height: "30px" }}>{t("提单号")}</span>}
            rules={numberRules}
          >
            <FilterTextArea
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="bigBagNoList"
            label={<span style={{ height: "30px" }}>{t("袋号")}</span>}
            rules={numberRules}
          >
            <FilterTextArea
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <div>
            <div style={{ paddingBottom: "8px", width: "120px" }}>
              <Form.Item noStyle name="otherType">
                <SearchSelect
                  filterOption={false}
                  allowClear={false}
                  style={{ width: "100%" }}
                  optionKey="customsItemInfoOtherTypes"
                />
              </Form.Item>
            </div>
            <Form.Item name="otherList" rules={numberRules}>
              <FilterTextArea
                placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
              />
            </Form.Item>
          </div>
        </Col>
        <Col span={6}>
          <Form.Item
            name="customerName"
            label={<span style={{ height: "30px" }}>{t("客户名称")}</span>}
          >
            <Input placeholder={t("客户名称")} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="createTime">
            <PredefinedRange label={t("包裹信息获取日期")} />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container
        title={t("商品详细信息")}
        table
        titleExtend={<ColSelector tableKey="商品详细信息" config={columns} />}
      >
        <Row className="my-4" justify="space-between">
        <Button
            onClick={store.showUploadModal.bind(store)}
            className="operation-btn mr-4"
            icon={<CloudUploadOutlined />}
          >
            {t("批量上传")}
          </Button>
          <span>
          <Button
            onClick={handleExportAll}
            className="operation-btn mr-4"
            icon={<CloudDownloadOutlined />}
          >
            {t("导出所有商品信息")}
          </Button>
          <Button
            onClick={handleExportQuery}
            className="operation-btn"
            icon={<CloudDownloadOutlined />}
          >
            {t("导出已筛选商品信息")}
          </Button>
          </span>
        </Row>
        <Table
          useColWidth
          tableKey="商品详细信息"
          highlight
          widthFit
          bordered
          loading={gridStore.loading}
          tableLayout="auto"
          rowKey="itemId"
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
    </Container>
  );
}

const ClearanceOfGoods = observer(ClearanceOfGoodsComponent);

export default ClearanceOfGoods;

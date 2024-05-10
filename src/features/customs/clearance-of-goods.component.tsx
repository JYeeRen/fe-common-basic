import { observer } from "mobx-react-lite";
import { useStore } from "@hooks";
import {
  Button,
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  Row,
  SearchSelect,
  Table,
  textareaMaxLengthRule,
} from "@components";
import { ClearanceOfGoodsStore } from "./clearance-of-goods.store";
import * as CustomItemConfig from "./clearance-of-goods.config";
import styles from "./clerance-of-goods.module.less";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { CustomITemsQueryParams } from "./types";
import { compact } from "lodash";

function ClearanceOfGoodsComponent() {
  const { t } = useStore(ClearanceOfGoodsStore)();

  const gridStore = ClientGrid.useGridStore(CustomItemConfig.getRows);

  const columns = useMemo(() => CustomItemConfig.getGridColumns(), []);

  const handleFinish = (values: CustomITemsQueryParams) => {
    const { masterWaybillNoList, bigBagNoList, otherType, otherList } = values;
    gridStore.setQueryParams({
      masterWaybillNoList: masterWaybillNoList && compact(masterWaybillNoList),
      bigBagNoList: bigBagNoList && compact(bigBagNoList),
      otherList: otherList && compact(otherList),
      otherType,
    });
  };

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={styles.container}>
      <FilterContainer
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ otherType: 0 }}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 20 }}
      >
        <Col span={8}>
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
        <Col span={8}>
          <Form.Item
            name="bigBagNoList"
            label={<span style={{ height: "30px" }}>{t("袋号")}</span>}
            rules={numberRules}
          >
            <FilterTextArea
              style={{ width: "100%" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
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
            <Form.Item name="otherList">
              <FilterTextArea
                placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
              />
            </Form.Item>
          </div>
        </Col>
      </FilterContainer>
      <Container title={t("商品详细信息")}>
        <Row className="my-4">
          <Button
            onClick={() => {}}
            className="operation-btn"
            icon={<CloudDownloadOutlined />}
          >
            {t("导出所有商品信息")}
          </Button>
          <Button
            onClick={() => {}}
            className="operation-btn"
            icon={<CloudDownloadOutlined />}
          >
            {t("导出已筛选商品信息")}
          </Button>
        </Row>
        <Table
          widthFit
          bordered
          loading={gridStore.loading}
          tableLayout="auto"
          // rowSelection={{ type: "checkbox" }}
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

const ClearanceOfGoods = observer(ClearanceOfGoodsComponent);

export default ClearanceOfGoods;

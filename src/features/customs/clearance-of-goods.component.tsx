import { observer } from "mobx-react-lite";
import { useStore } from "@hooks";
import {
  Button,
  ClientGrid,
  Container,
  Row,
  Table,
} from "@components";
import { ClearanceOfGoodsStore } from "./clearance-of-goods.store";
import * as CustomItemConfig from "./clearance-of-goods.config";
import styles from "./clerance-of-goods.module.less";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { useMemo } from "react";


function ClearanceOfGoodsComponent() {
  const { t } = useStore(ClearanceOfGoodsStore)();

  const gridStore = ClientGrid.useGridStore(CustomItemConfig.getRows);

  const columns = useMemo(() => CustomItemConfig.getGridColumns(), []);

  // const columns: TableColumnsType<CustomItem> = useMemo(() => {
  //   const cols = CustomItemConfig.getGridColumns();
  //   const widthMap = new Map();
  //   gridStore.rowData.forEach((target) => {
  //     for (let key in target) {
  //       if (target.hasOwnProperty(key)) {
  //         let keyWidth = getTextWidth(target[key]);
  //         let curValue = widthMap.get(key);
  //         // 字段有值就放入数组
  //         widthMap.set(key, Math.max(curValue, keyWidth));
  //       }
  //     }
  //   });

  //   columns.map((item) => {
  //     const textWidth = getTextWidth(item.title as string);
  //     if (widthMap.get(item.dataIndex) < textWidth) {
  //       widthMap.set(item.dataIndex, textWidth);
  //     }
  //     return (item.width = Math.ceil(widthMap.get(item.dataIndex)) + 35);
  //   });
  // }, []);

  // console.log(columns, gridStore.rowData);

  return (
    <Container className={styles.container}>
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
        {/* <DataGrid
          columns={columns}
          dataSource={gridStore.rowData}
        /> */}
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
          // scroll={{ x: 10000 }}
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

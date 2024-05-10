import {
  ClientGrid,
  // Col,
  Container,
  FilterContainer,
  // Form,
  // Input,
  // SearchSelect,
  // Table,
} from "@components";
import { observer } from "mobx-react-lite";
import * as BillOfLadingConfig from "./bill-of-lading-config";
import styles from "./bill-of-lading.module.less";
import { useCallback, useMemo } from "react";
import { useStore } from "@hooks";
import { BillOfLadingStore } from "./bill-of-lading.store";
import { CustomsStatusFormValues } from "./type";

function TrackTraceComponent() {
  const { store, t } = useStore(BillOfLadingStore)();
  const gridStore = ClientGrid.useGridStore(BillOfLadingConfig.getRows);
  // const columns = useMemo(() => BillOfLadingConfig.getColumns(), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, customsStatusType } = values;
    gridStore.setQueryParams({
      noList: noList || undefined,
      noType: noType || undefined,
      customsStatusType: customsStatusType || undefined,
    });
  }, []);

  const initialValues: CustomsStatusFormValues = useMemo(
    () => ({ customsStatusType: "cb_imcustoms_start" }),
    []
  );

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer
        onFinish={handleFinish}
        layout="vertical"
        initialValues={initialValues}
      >
        {/* <Col span={12}>
          <Form.Item name="productName" label={t("英文品名")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="customsStatusType" label={t("轨迹名称")}>
            <SearchSelect optionKey="tikTokActionCodeList" />
          </Form.Item>
        </Col> */}
      </FilterContainer>
      <Container title={t("航空信息")} wrapperClassName={styles.wrapper}>
        {/* <Table
          widthFit
          bordered
          loading={gridStore.loading}
          // rowSelection={{ type: "checkbox" }}
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
        /> */}
      </Container>
    </Container>
  );
}

const Template = observer(TrackTraceComponent);

export default Template;

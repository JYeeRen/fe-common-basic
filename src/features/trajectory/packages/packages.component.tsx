import {
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  Radio,
  SearchSelect,
  textareaMaxLengthRule,
  Table,
  Row,
  Button,
} from "@components";
import { observer } from "mobx-react-lite";
import * as ListConfig from "./packages-config";
import styles from "./packages.module.less";
import { useCallback, useMemo } from "react";
import { useStore } from "@hooks";
import { PacageCustomsTrackStore } from "./packages.store";
import { FormValues } from "./type";
import optionsService from "@services/options.service";
import { compact } from "lodash";
import { CloudDownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { CreateModal } from "./create-modal";

function TrackTraceComponent() {
  const initialValues: FormValues = useMemo(() => ({ noType: 0, actionCode: "all" }), []);
  const gridStore = ClientGrid.useGridStore(ListConfig.getRows, { initialValues });
  const { store, t } = useStore(PacageCustomsTrackStore, gridStore)();
  const columns = useMemo(() => ListConfig.getColumns(), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, actionCode } = values;
    gridStore.setQueryParams({
      noList: compact(noList),
      noType: noType,
      actionCode: actionCode,
    });
  }, [gridStore]);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={styles.container} loading={store.loading} table>
      <FilterContainer
        onFinish={handleFinish}
        layout="vertical"
        initialValues={initialValues}
      >
        <Col span={10}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {optionsService.customsTrackPackageNoTypes.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item name="noList" wrapperCol={{ span: 22 }} rules={numberRules}>
            <FilterTextArea
              style={{ width: "100%", height: 75, resize: "none" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="actionCode" label={t("轨迹名称")}>
            <SearchSelect optionKey="actionCodeList" />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("异常轨迹信息")} wrapperClassName={styles.wrapper}>
      <Row justify="space-between" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<PlusOutlined />}
            onClick={store.toogleModalVisible.bind(store)}
          >
            {t("包裹信息录入")}
          </Button>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<CloudDownloadOutlined />}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={store.export.bind(store, gridStore.queryParams as any)}
          >
            {t("导出已筛选数据")}
          </Button>
        </Row>
        <Table
          highlight
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
        />
      </Container>
      {store.createModalVisible && <CreateModal store={store} />}
    </Container>
  );
}

const Template = observer(TrackTraceComponent);

export default Template;

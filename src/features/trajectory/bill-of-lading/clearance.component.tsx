import {
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  SearchSelect,
  Table,
  Tabs,
  TabsProps,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import * as gridConfig from "./clearance.config";
import { useStore } from "../../../hooks/useStore.hook";
import { ClearanceStore } from "./clearance.store";
import styles from "./bill-of-lading.module.less";
import tabsStyles from "./tabs.module.less";
import clsx from "clsx";
import { compact } from "lodash";
import { UploadClearance } from "./upload-clearance.component";

function ClearanceComponent() {
  const { store, t, navigate } = useStore(ClearanceStore)();
  const gridStore = ClientGrid.useGridStore(gridConfig.getRows);

  const [uploadingId, setUploadingId] = useState(0);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const columns = gridConfig.getColumns({
    upload: (id: number) => setUploadingId(id),
    download: (id: number) => store.download(id),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = (values: any) => {
    const { masterWaybillNoList, status } = values || {};
    gridStore.setQueryParams({
      masterWaybillNoList: compact(masterWaybillNoList),
      status,
    });
  };

  const children = (
    <Container className={clsx(tabsStyles.subcontainer, tabsStyles.container)}>
      <UploadClearance
        store={store}
        refreshTable={gridStore.loadData.bind(gridStore)}
        onCancel={() => setUploadingId(0)}
        open={uploadingId !== 0}
      />
      <FilterContainer onFinish={handleFinish} layout="vertical">
        <Col span={12}>
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
        <Col span={12}>
          <Form.Item
            name="status"
            label={<span style={{ height: "30px" }}>{t("回传状态")}</span>}
          >
            <SearchSelect optionKey="clearanceFileStatusTypes" />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container
        title={t("通关文件回传")}
        wrapperClassName={styles.wrapper}
        table
      >
        <Table
          widthFit
          bordered
          loading={gridStore.loading}
          rowKey="id"
          dataSource={gridStore.rowData}
          columns={columns}
          size="small"
          maxHeight={351}
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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("提单轨迹信息"),
    },
    {
      key: "2",
      label: t("通关文件回传"),
      children: children,
    },
  ];

  return (
    <Container className={tabsStyles.container}>
      <Tabs
        activeKey="2"
        items={items}
        onTabClick={(activeKey) => {
          if (activeKey === "1") {
            navigate("/customs/trajectory/bill-of-lading");
            return;
          }
        }}
      />
    </Container>
  );
}

const Clearance = observer(ClearanceComponent);

export default Clearance;

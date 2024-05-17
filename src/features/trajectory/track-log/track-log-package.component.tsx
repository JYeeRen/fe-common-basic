import {
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  Radio,
  SearchSelect,
  Table,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import * as listConfig from "./track-log-package-config";
import styles from "./track-info.module.less";
import { useCallback, useMemo } from "react";
import { PackageFormValues } from "./type";
import optionsService from "@services/options.service";
import { compact } from "lodash";
import { TrackLogStore } from "./track-log.store";
import { useTranslation } from "@locale";
import clsx from "clsx";

interface PackageProps {
  store: TrackLogStore;
}

function TrackLogPackageComponent(props: PackageProps) {
  const { store } = props;
  const [t] = useTranslation();

  const columns = useMemo(
    () => listConfig.getColumns(),
    [optionsService.waybillTrackStatusList]
  );

  const initialValues: PackageFormValues = useMemo(
    () => ({ noType: 0, actionCode: "all" }),
    []
  );

  const gridStore = ClientGrid.useGridStore(listConfig.getRows, {
    initialValues,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, actionCode } = values;
    gridStore.setQueryParams({
      noList: compact(noList),
      noType: noType,
      actionCode: actionCode,
    });
  }, []);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container
      className={clsx(styles.container, styles.subcontainer)}
      loading={store.loading}
    >
      <FilterContainer
        onFinish={handleFinish}
        layout="vertical"
        initialValues={initialValues}
      >
        <Col span={8}>
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
          <Form.Item name="actionCode" label={t("轨迹名称")}>
            <SearchSelect optionKey="actionCodeList" />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("货物状态跟踪")} wrapperClassName={styles.wrapper}>
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

const PacakgeTrackLog = observer(TrackLogPackageComponent);

export default PacakgeTrackLog;

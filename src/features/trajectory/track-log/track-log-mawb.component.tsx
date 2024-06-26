import {
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  SearchSelect,
  Table,
  textareaMaxLengthRule,
  ClientGrid,
} from "@components";
import * as mawbListConfig from './track-log-mawb-config';
import { observer } from "mobx-react-lite";
import * as listConfig from "./track-log-mawb-config";
import styles from "./track-info.module.less";
import { useCallback, useMemo } from "react";
import { MawbFormValues } from "./type";
import { compact } from "lodash";
import { TrackLogStore } from "./track-log.store";
import { useTranslation } from "@locale";
import clsx from "clsx";
import optionsService from "@services/options.service";

interface MawbProps {
  store: TrackLogStore;
}

function TrackLogMawbComponent(props: MawbProps) {
  const { store } = props;

  const [t] = useTranslation();

  const initialValues: MawbFormValues = useMemo(
    () => ({ masterWaybillNoList: [], waybillStatusCode: 'all' }),
    []
  );

  const gridStore = ClientGrid.useGridStore(mawbListConfig.getRows, { initialValues });
  const columns = useMemo(() => listConfig.getColumns(), [optionsService.waybillTrackStatusList]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { masterWaybillNoList, waybillStatusCode } = values;
    gridStore.setQueryParams({
      masterWaybillNoList: compact(masterWaybillNoList),
      waybillStatusCode: waybillStatusCode,
    });
  }, []);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={clsx(styles.container, styles.subcontainer)} loading={store.loading}>
      <FilterContainer
        onFinish={handleFinish}
        layout="vertical"
        initialValues={initialValues}
      >
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
          <Form.Item name="waybillStatusCode" label={t("轨迹名称")}>
            <SearchSelect optionKey="waybillTrackStatusList" />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("轨迹信息")} wrapperClassName={styles.wrapper} table>
        <Table
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
    </Container>
  );
}

const MawbTrackLog = observer(TrackLogMawbComponent);

export default MawbTrackLog;

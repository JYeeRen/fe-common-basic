import {
  Button,
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  Input,
  Radio,
  Row,
  SearchSelect,
  Table,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import * as listConfig from "./track-log-package-config";
import styles from "./track-info.module.less";
import { Key, useCallback, useMemo, useState } from "react";
import { PackageFormValues } from "./type";
import optionsService from "@services/options.service";
import { compact } from "lodash";
import { TrackLogStore } from "./track-log.store";
import { useTranslation } from "@locale";
import clsx from "clsx";
import { PlusOutlined } from "@ant-design/icons";

interface PackageProps {
  store: TrackLogStore;
}

function TrackLogPackageComponent(props: PackageProps) {
  const { store } = props;
  const [t] = useTranslation();

  const [selectedRowKeys, setgSelectedRowKeys] = useState<Key[]>([]);

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
    const { noList, noType, actionCode, uploadStatus, nextProviderName } = values;
    setgSelectedRowKeys([]);
    gridStore.setQueryParams({
      nextProviderName,
      noList: compact(noList),
      noType: noType,
      actionCode: actionCode,
      uploadStatus,
    });
  }, []);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const handleUpload = async () => {
    if (!selectedRowKeys.length) return;``
    await store.uploadPackageTrack(selectedRowKeys as number[]);
    await gridStore.loadData();
    setgSelectedRowKeys([]);
  };

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
        <Col span={16}>
          <Row>
            <Col span={12}>
              <Form.Item name="actionCode" label={t("轨迹名称")}>
                <SearchSelect optionKey="actionCodeList" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="uploadStatus" label={t("接收状态")}>
                <SearchSelect optionKey="trackUploadStatusTypes" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nextProviderName" label={t("末端服务商")}>
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </FilterContainer>
      <Container
        title={t("货物状态跟踪")}
        wrapperClassName={styles.wrapper}
        table
      >
        <Row className="my-4">
          <Button
            disabled={selectedRowKeys.length === 0}
            onClick={handleUpload}
            className="operation-btn"
            icon={<PlusOutlined />}
          >
            {t("手动推送")}
          </Button>
        </Row>
        <Table
          useColWidth
          widthFit
          bordered
          loading={gridStore.loading}
          rowSelection={{
            type: "checkbox",
            hideSelectAll: true,
            onChange: (keys) => setgSelectedRowKeys(keys),
            selectedRowKeys,
            getCheckboxProps: (row) => ({
              disabled: row.uploadCompleted !== 3,
            }),
          }}
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
          onChange={gridStore.onCommonTableChange.bind(gridStore)}
        />
      </Container>
    </Container>
  );
}

const PacakgeTrackLog = observer(TrackLogPackageComponent);

export default PacakgeTrackLog;

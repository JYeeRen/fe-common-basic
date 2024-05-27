/* eslint-disable prefer-const */
import {
  ClientGrid,
  Col,
  Container,
  EditableDateCell,
  FilterContainer,
  FilterTextArea,
  Form,
  Modal,
  Radio,
  SearchSelect,
  Table,
  notification,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import * as listConfig from "./track-trace-config";
import styles from "./track-trace.module.less";
import { useCallback, useMemo } from "react";
import { useStore } from "@hooks";
import { TrackTraceStore } from "./track-trace.store";
import { CustomsTrackStatus, CustomsTrackStatusFormValues } from "./type";
import optionsService from "@services/options.service";
import { compact } from "lodash";
import { CellEditModal } from "./cell-edit-modal.component";
import { dayjs } from "@infra";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function TrackTraceComponent() {
  const { store, t } = useStore(TrackTraceStore)();
  const initialValues: CustomsTrackStatusFormValues = useMemo(
    () => ({ statusType: 0, noType: 0 }),
    []
  );
  const gridStore = ClientGrid.useGridStore(listConfig.getRows, { initialValues });
  const columns = useMemo(() => listConfig.getColumns(store.setEditingCell.bind(store)), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, statusType } = values;
    gridStore.setQueryParams({
      noList: compact(noList),
      noType: noType,
      statusType: statusType,
    });
  }, []);

  const updateConfirm = useCallback(
    async (record: CustomsTrackStatus, key: string) => {
      const typeDict: Record<string, string> = {
        customs_submitted: t("数据提交海关"),
        customs_accepted: t("海关接收数据"),
        customs_release: t("海关放行（整票放行）"),
        picked_up: t("货物已提货"),
        handed_over: t("货物交接尾程"),
        customs_inspection: t("海关查验（整票查验）"),
      };

      return new Promise((resolve) => {
        Modal.confirm({
          title: t("操作确认"),
          content: (
            <>
              <p>
                {t(
                  "当前录入的轨迹时间与旧时间不一致，是否确认修改提单号“{{no}}”的“{{type}}”时间？",
                  { no: record.masterWaybillNo, type: typeDict[key] }
                )}
              </p>
              <p>
                <span style={{ display: "inline-block", color: "orange" }}>
                  {t("注意：")}
                </span>
                <span>
                  {t(
                    "确认修改后，将更新操作时间为最新时间，影响时效计算，该操作不可逆，请谨慎操作！"
                  )}
                </span>
              </p>
            </>
          ),
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
          okText: t("确认上传"),
          cancelText: t("放弃录入"),
        });
      });
    },
    []
  );

  const over24Confirm = useCallback(async (): Promise<boolean> => {
    return await new Promise((resolve) => {
      Modal.confirm({
        title: t("警告！"),
        content: t(
          "当前录入的轨迹发生时间已超过当前时间24小时以上，是否确认上传轨迹？"
        ),
        okText: t("确认上传"),
        cancelText: t("放弃录入"),
        icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
        okButtonProps: { danger: true },
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  const handleSave = async (date: string, tz: string) => {
    if (!store.editingCell?.record || !store.editingCell.key) {
      return false;
    }
    const record = store.editingCell.record;
    const key = store.editingCell.key;
    const value = date;
    if (!(await updateConfirm(record, key))) {
      return true;
    }

    const diffmins = dayjs()
      .utcOffset(480)
      .diff(dayjs(value).utcOffset(480), "m");

    if (diffmins > 24 * 60 && !(await over24Confirm())) {
      return true;
    }

    if (key === 'ata' || key === 'atd') {
      if (!record.mawbId) {
        notification.error({
          message: t("保存失败"),
          description: t("提单未关联不能设置 ATA ATD"),
        });
        return true;
      }
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let failed: any[] = [];
      if (key === "ata") {
        if (!record.mawbId) {
          return true;
        }
        await store.setMawbAta(record.mawbId, tz, value);
      } else if (key === "atd") {
        if (!record.mawbId) {
          return true;
        }
        await store.setMawbAtd(record.mawbId, tz, value);
      } else if (key == 'deliveredTime') {
        await store.setPackageDelivered(record.id, tz, value);
      } else if (key == 'pickedUpTime') {
        await store.setPackagePickedUp(record.id, tz, value);
      }
      if (!failed.length) {
        return true;
      }
      notification.error({
        message: t("保存失败"),
        description: failed
          .map((item) => `${item.number} ${item.reason}`)
          .join("\n"),
      });
      return true;
    } finally {
      gridStore.loadData();
    }
  };

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer
        onFinish={handleFinish}
        layout="vertical"
        initialValues={initialValues}
      >
        <Col span={10}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {optionsService.customsTrackStatusNoTypes.map((opt) => (
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
          <Form.Item name="statusType" label={t("轨迹名称")}>
            <SearchSelect optionKey="customsTrackStatusTypes" />
          </Form.Item>
        </Col>
      </FilterContainer>
      {Boolean(store.editingCell) && (
        <CellEditModal
          open={Boolean(store.editingCell)}
          store={store}
          record={gridStore.rowData.find(
            (r) => r.id === store.editingCell?.record.id
          )}
          handleSave={handleSave}
        />
      )}
      <Container title={t("货物状态跟踪")} wrapperClassName={styles.wrapper} table>
        <Table
          widthFit
          bordered
          loading={gridStore.loading}
          // rowSelection={{ type: "checkbox" }}
          rowKey="id"
          dataSource={gridStore.rowData}
          columns={columns}
          size="small"
          components={{ body: { cell: EditableDateCell } }}
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
        />
      </Container>
    </Container>
  );
}

const Template = observer(TrackTraceComponent);

export default Template;

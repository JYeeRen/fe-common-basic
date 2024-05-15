import {
  Block,
  Button,
  ClientGrid,
  Col,
  DatePicker,
  FilterTextArea,
  Form,
  Modal,
  ModalProps,
  Radio,
  Row,
  SearchSelect,
  Space,
  SubmitButton,
  Table,
  textareaMaxLengthRule,
} from "@components";
import { observer } from "mobx-react-lite";
import { PacageCustomsTrackStore } from "./packages.store";
import { useTranslation } from "@locale";
import optionsService from "@services/options.service";
import { useCallback, useMemo, useState } from "react";
import * as listConfig from "./create-modal-config";
import { compact, find } from "lodash";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./create-modal.module.less";
import dayjs, { Dayjs } from "dayjs";

interface FieldProps {
  store: PacageCustomsTrackStore;
}

const Field = observer((props: FieldProps) => {
  const { store } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({ actionCode: "cb_imcustoms_start" }),
    []
  );

  const confirm = useCallback(() => {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = async () => {
    const { actionCode, timeZone, operateTime } = form.getFieldsValue();
    const tzItem = find(optionsService.timeZones, { value: timeZone });
    const operateTimeWithTZ: Dayjs = operateTime.add(tzItem?.offset, "second");

    store.updateCreateParams({
      timeZone: tzItem?.value ?? "",
      operateTime: operateTimeWithTZ.format(),
      actionCode,
    });

    if (operateTimeWithTZ.isAfter(dayjs().add(24, "hour"))) {
      Modal.confirm({
        title: t("警告！"),
        content: t(
          "当前录入的轨迹发生事件已超过当前时间24小时以上，是否确认上传轨迹？"
        ),
        okText: t("确认上传"),
        cancelText: t("放弃录入"),
        icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
        okButtonProps: { danger: true },
        onOk:
      });
    }
    return;
    console.log(JSON.stringify(store.createParams));
    const fileds = await store.addPackageTrack(store.createParams);
    if (fileds.length === 0) {
      store.toogleModalVisible();
      return;
    }
  };

  return (
    <div className={styles.fieldContainer}>
      <Form
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label={t("轨迹名称")}
          name="actionCode"
          rules={[{ required: true }]}
        >
          <SearchSelect
            optionKey="actionCodeList"
            allowClear={false}
            style={{ width: "160px" }}
          />
        </Form.Item>
        <Form.Item label={t("轨迹发生时间")}>
          <Space.Compact>
            <Form.Item name="timeZone" noStyle rules={[{ required: true }]}>
              <SearchSelect
                optionKey="timeZones"
                allowClear={false}
                style={{ width: "160px" }}
              />
            </Form.Item>
            <Form.Item name="operateTime" noStyle rules={[{ required: true }]}>
              <DatePicker
                showTime
                allowClear={false}
                style={{ width: "200px" }}
                format={"YYYY-MM-DD HH:mm"}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      </Form>
      <Row justify="end" className="my-4">
        <Button className="mr-4" onClick={store.toogleModalVisible.bind(store)}>
          {t("取消")}
        </Button>
        <SubmitButton
          form={form}
          loading={store.loading}
          onClick={handleFinish}
        >
          {t("下一步")}
        </SubmitButton>
      </Row>
    </div>
  );
});

interface QueryProps {
  store: PacageCustomsTrackStore;
  onOk: (ids: number[]) => void;
}

const Query = observer((props: QueryProps) => {
  const { store, onOk } = props;
  const [t] = useTranslation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const columns = useMemo(() => listConfig.getColumns(), []);

  const gridStore = ClientGrid.useGridStore(listConfig.getRows, {
    autoLoad: false,
  });

  const [form] = Form.useForm();

  const handleQuery = () => {
    const { noType, noList } = form.getFieldsValue();
    setSelectedRowKeys([]);
    gridStore.setQueryParams({
      noType,
      noList: compact(noList),
    });
  };

  const handleOk = () => {
    store.updateCreateParams({ ids: selectedRowKeys });
    onOk(selectedRowKeys);
  };

  return (
    <div className="p-4 w-full">
      <Form form={form} onFinish={handleQuery}>
        <p className="pb-4">{t("数据查找：")}</p>
        <Row>
          <Col span={18}>
            <Form.Item noStyle name="noType">
              <Radio.Group className="mb-2">
                {optionsService.customsTrackPackageNoTypes.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="noList"
              wrapperCol={{ span: 24 }}
              rules={numberRules}
            >
              <FilterTextArea
                style={{ width: "100%", height: 75, resize: "none" }}
                placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
              />
            </Form.Item>
          </Col>
          <Col offset={1} span={4} className="flex items-end mb-8">
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              {t("查询")}
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        widthFit
        bordered
        loading={gridStore.loading}
        rowSelection={{
          // hideSelectAll: true,
          type: "checkbox",
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
          selectedRowKeys: selectedRowKeys,
        }}
        rowKey="id"
        dataSource={gridStore.rowData}
        columns={columns}
        size="small"
        pagination={
          gridStore.total > 0 && {
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
          }
        }
      />
      <Row justify="end" className="my-4">
        <Button className="mr-4" onClick={store.toogleModalVisible.bind(store)}>
          {t("取消")}
        </Button>
        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0}
          loading={store.loading}
          onClick={handleOk}
        >
          {t("下一步")}
        </Button>
      </Row>
    </div>
  );
});

interface CreateModalProps extends ModalProps {
  store: PacageCustomsTrackStore;
}

export const CreateModal = observer((props: CreateModalProps) => {
  const { store, ...modalProps } = props;
  const [t] = useTranslation();

  const [step, setStep] = useState(1);

  const handleSelected = (ids: number[]) => {
    if (ids.length > 0) {
      setStep(2);
    }
  };

  return (
    <Modal
      {...modalProps}
      open={store.createModalVisible}
      destroyOnClose
      onCancel={store.toogleModalVisible.bind(store)}
      maskClosable={false}
      title={t("异常轨迹录入")}
      width={760}
      footer={null}
      afterClose={() => {
        setStep(1);
      }}
    >
      <Block if={step === 1}>
        <Query store={store} onOk={handleSelected} />
      </Block>
      <Block if={step === 2}>
        <Field store={store} />
      </Block>
    </Modal>
  );
});

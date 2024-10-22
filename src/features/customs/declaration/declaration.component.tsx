import {
  Button,
  ClientGrid,
  Col,
  Container,
  FilterContainer,
  FilterTextArea,
  Form,
  Modal,
  Radio,
  Row,
  Table,
  EditableCell,
  textareaMaxLengthRule,
  PredefinedRange,
  convertPredefinedRange,
  getTime,
} from "@components";
import { observer } from "mobx-react-lite";
import * as declareStatusConfig from "./declaration-config";
import styles from "./declaration.module.less";
import { useCallback, useEffect, useMemo } from "react";
import { useStore } from "@hooks";
import { DeclrationStore } from "./declaration.store";
import { CustomsDocument, CustomsDocumentFormValues } from "./type";
import {
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import optionsService from "@services/options.service";
import { compact } from "lodash";
import { ViewDocumentModal } from "./components/viewDocumentModal.component";
import { CreateDocumentModal } from "./components/createDocumentModal.component";
import { EditDocumentModal } from "./components/editDocumentModal.component";
import { CreatePrealerttModal } from "./components/creatPrealertModal.component";
import dayjs from "dayjs";

function DeclareStatusComponent() {
  const initialValues: CustomsDocumentFormValues = useMemo(
    () => ({
      noType: 0,
      days: "today",
      uploadDate: getTime({ predefined: 7 })
    }),
    []
  );

  const gridStore = ClientGrid.useGridStore(declareStatusConfig.getRows, {
    initialValues,
    autoLoad: false,
  });
  const { store, t } = useStore(DeclrationStore, gridStore)(gridStore);

  useEffect(() => {
    optionsService.refresh("customsTemplates");
    optionsService.refresh("prealertTemplates");
  }, []);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  useEffect(() => {
    if (store.warning) {
      Modal.warning({
        title: t("警告！"),
        content: t(
          "有单号处于货物已起飞，但相关清关预报资料未完成状态，请注意及时查看！"
        ),
        okText: t("去查看"),
        icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
        okButtonProps: { danger: true },
        onOk: () => store.setWarning(false),
      });
    }
  }, [store.warning]);

  const cancelDeclaration = useCallback(({ id }: { id: number }) => {
    Modal.confirm({
      title: t("操作确认"),
      content: t(
        "取消制作后，订单关务状态会变为“未制作”，已保存的文件将被永久删除。此操作不可恢复，请谨慎操作。"
      ),
      okText: t("确认取消制作"),
      cancelText: t("取消"),
      onOk: () => store.cancel(id),
    });
  }, []);

  const columns = useMemo(() => {
    const colDefs = declareStatusConfig.getColumns({
      customsStatusTypes: optionsService.customsStatusTypes,
      operation: {
        view: store.setViewing.bind(store),
        edit: store.setEditing.bind(store),
        cancel: cancelDeclaration,
      },
    });
    return colDefs;
  }, [optionsService.customsStatusTypes]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType, uploadDate } = values;
    gridStore.setQueryParams({
      noList: compact(noList),
      noType,
      uploadDate: convertPredefinedRange(uploadDate),
    });
  }, []);

  const tableClassName = useCallback(
    (record: CustomsDocument) => (record.warning ? styles.warining : ""),
    []
  );

  const takeofCheck = () => {
    if (
      store.selectedTakeOf.length > 0 &&
      store.selectedTakeOf.length !== store.selectedRows.length
    ) {
      Modal.error({
        title: t("操作确认"),
        content: t(
          "已选提单中包含已起飞提单，无法人工制作。如需系统生成文件，请单独操作已起飞提单。"
        ),
        okText: t("确认"),
      });
      return false;
    }
    return true;
  };

  const handleDocumentCreate = () => {
    if (!takeofCheck()) {
      return;
    }

    if (store.customFileCreated.length > 0 && store.hasTakeOf) {
      Modal.error({
        title: t("操作确认"),
        content: (
          <span>
            <p>
              {t(
                "已选提单中包含已起飞且清关单证已完成提单，无法操作。已完成提单如下："
              )}
            </p>
            {store.customFileCreated.map((row) => (
              <p key={row.id}>{row.masterWaybillNo}</p>
            ))}
          </span>
        ),
        okText: t("确认"),
      });
      return;
    }

    if (!(store.customFileCreated.length > 0)) {
      return store.setCreatingCustomDocs(true);
    }

    Modal.confirm({
      title: t("操作确认"),
      content: (
        <div>
          <p>
            {t(
              "检测到当前选择的订单在系统内存在已制作完成的文件，若选择继续操作，系统将根据选择的模板生成新文件覆盖当前已上传的文件。"
            )}
          </p>
          <p>{t("此操作不可恢复，请谨慎操作。")}</p>
        </div>
      ),
      okText: t("确认修改模板"),
      cancelText: t("取消"),
      onOk: () => store.setCreatingCustomDocs(true),
    });
  };

  const handlePrealerCreate = () => {
    if (!takeofCheck()) {
      return;
    }

    if (store.prealertFileCreated.length > 0 && store.hasTakeOf) {
      Modal.error({
        title: t("操作确认"),
        content: (
          <span>
            <p>
              {t(
                "已选提单中包含已起飞且预报文件已完成提单，无法操作。已完成提单如下："
              )}
            </p>
            {store.prealertFileCreated.map((row) => (
              <p key={row.id}>{row.masterWaybillNo}</p>
            ))}
          </span>
        ),
        okText: t("确认"),
      });
      return;
    }

    if (!(store.prealertFileCreated.length > 0)) {
      return store.setCreatingPrealertDocs(true);
    }

    Modal.confirm({
      title: t("操作确认"),
      content: (
        <div>
          <p>
            {t(
              "检测到当前选择的订单在系统内存在已制作完成的文件，若选择继续操作，系统将根据选择的模板生成新文件覆盖当前已上传的文件。"
            )}
          </p>
          <p>{t("此操作不可恢复，请谨慎操作。")}</p>
        </div>
      ),
      okText: t("确认修改模板"),
      cancelText: t("取消"),
      onOk: () => store.setCreatingPrealertDocs(true),
    });
  };

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Col span={7}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {optionsService.customsStatusNoTypes.map((opt) => (
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
        <Col span={24}>
          <Form.Item name="uploadDate" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            <PredefinedRange label={t("数据生成时间")} />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container
        title={t("清关单证制作")}
        wrapperClassName={styles.wrapper}
        table
      >
        <Row justify="start" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<UploadOutlined />}
            disabled={store.initiateDisabled}
            onClick={handleDocumentCreate}
          >
            {t("清关单证制作")}
          </Button>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<UploadOutlined />}
            disabled={store.initiateDisabled}
            onClick={handlePrealerCreate}
          >
            {t("预报文件制作")}
          </Button>
          <Button
            onClick={store.downloadSelectedCopyFile.bind(store)}
            disabled={store.selectedRowKeys.length === 0}
            className="operation-btn"
            icon={<CloudUploadOutlined />}
          >
            {t("下载清关提货文件")}
          </Button>
        </Row>
        <Table
          components={{ body: { cell: EditableCell } }}
          widthFit
          bordered
          loading={gridStore.loading}
          rowSelection={{
            hideSelectAll: false,
            type: "checkbox",
            onChange: (keys) => store.setSelectedRowKeys(keys as number[]),
            selectedRowKeys: store.selectedRowKeys,
            getCheckboxProps: (row) => {
              const takeOfAt = row.atdIso || row.etdIso;
              return {
                disabled:
                  dayjs(takeOfAt).isBefore(dayjs()) &&
                  row.customsFile &&
                  row.prealertFile,
              };
            },
          }}
          rowKey="id"
          dataSource={gridStore.rowData}
          columns={columns}
          size="small"
          rowClassName={tableClassName}
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
          onChange={gridStore.onCommonTableChange.bind(gridStore)}
        />
      </Container>
      <ViewDocumentModal store={store} />
      <CreateDocumentModal store={store} />
      <EditDocumentModal store={store} />
      <CreatePrealerttModal store={store} />
    </Container>
  );
}

const Template = observer(DeclareStatusComponent);

export default Template;

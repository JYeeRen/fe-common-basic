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
import { compact, some } from "lodash";
import { ViewDocumentModal } from "./components/viewDocumentModal.component";
import { CreateDocumentModal } from "./components/createDocumentModal.component";
import { EditDocumentModal } from "./components/editDocumentModal.component";
import { CreatePrealerttModal } from "./components/creatPrealertModal.component";

function DeclareStatusComponent() {
  const gridStore = ClientGrid.useGridStore(declareStatusConfig.getRows, false);
  const { store, t } = useStore(
    DeclrationStore,
    gridStore
  )(gridStore);

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
      customsStatusTypes: optionsService.get("customsStatusTypes"),
      operation: {
        view: store.setViewing.bind(store),
        edit: store.setEditing.bind(store),
        cancel: cancelDeclaration,
      },
    });
    return colDefs;
  }, [optionsService.data.customsStatusTypes]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = useCallback((values: any = {}) => {
    const { noList, noType } = values;
    gridStore.setQueryParams({ noList: compact(noList), noType });
  }, []);

  const initialValues: CustomsDocumentFormValues = useMemo(
    () => ({
      noType: 0,
      days: "today",
    }),
    []
  );

  const noTypeOptions = useMemo(
    () => optionsService.get("customsStatusNoTypes"),
    [optionsService.data.customTemplateTypes]
  );

  const tableClassName = useCallback(
    (record: CustomsDocument) => (record.warning ? styles.warining : ""),
    []
  );

    const handleDocumentCreate = () => {
      if (!some(store.selectedRows, r => r.customsFile)) {
        return store.setCreatingCustomDocs(true); 
      }
      Modal.confirm({
        title: t('操作确认'),
        content: (
          <div>
            <p>{t('检测到当前选择的订单在系统内存在已制作完成的文件，若选择继续操作，系统将根据选择的模板生成新文件覆盖当前已上传的文件。')}</p>
            <p>{t('此操作不可恢复，请谨慎操作。')}</p>
          </div>
        ),
        okText: t('确认修改模板'),
        cancelText: t('取消'),
        onOk: () => store.setCreatingCustomDocs(true)
      });
    };

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Col span={7}>
          <div style={{ paddingBottom: "8px" }}>
            <Form.Item noStyle name="noType">
              <Radio.Group>
                {noTypeOptions.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item name="noList" wrapperCol={{ span: 22 }}>
            <FilterTextArea
              style={{ width: "100%", height: 75, resize: "none" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("清关单证制作")} wrapperClassName={styles.wrapper}>
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
            onClick={store.setCreatingPrealertDocs.bind(store, true)}
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
            hideSelectAll: true,
            type: "checkbox",
            onChange: (keys) => store.setSelectedRowKeys(keys as number[]),
            selectedRowKeys: store.selectedRowKeys,
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
            pageSizeOptions: [10, 30, 50, 100, 200, 500],
            defaultPageSize: 50,
            size: "default",
            onChange: gridStore.onTableChange.bind(gridStore),
          }}
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

import {
  Button,
  ClientGrid,
  Col,
  Container,
  EditableCell,
  FilterContainer,
  FilterTextArea,
  Form,
  Modal,
  Row,
  Table,
  textareaMaxLengthRule,
  Image
} from "@components";
import * as UldManageConfig from "@features/warehouse/uld/uld-manage.config.tsx";
import { useStore } from "@hooks";
import { UldManageStore } from "@features/warehouse/uld/uld-manage.store.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { compact } from "lodash";
import { UldInfo, UldInfoFormValues } from "@features/warehouse/uld/uld-manage.type.ts";
import styles from "@features/warehouse/uld/uld-manage.module.less";
import { DeleteOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";

function UldManageComponent() {
  const gridStore = ClientGrid.useGridStore(UldManageConfig.getRows, { autoLoad: false });
  const { store, t } = useStore(UldManageStore, gridStore)(gridStore);
  const [ImgVisible, setImgVisible] = useState(false);
  const [ImgUrl, setImgUrl] = useState<string[]>([]);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  const handleFinish = useCallback((values: any = {}) => {
    const { codes } = values;
    gridStore.setQueryParams({ codes: compact(codes) });
  }, []);

  const handleShow = useCallback(async (data: UldInfo) => {
    const res = await store.showInfo(data.id);
    setImgUrl(res.urlList);
    setImgVisible(true);
  }, []);

  const handleCancel = () => setImgVisible(false);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: t("操作确认"),
      content: t(
        "警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作。"
      ),
      okText: t("确认删除"),
      cancelText: t("取消"),
      onOk: () => store.delete(store.selectedRowKeys),
    });
  }, []);

  const initialValues: UldInfoFormValues = useMemo(
    () => ({ codes: [] }),
    []
  );

  const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

  const columns = useMemo(() => {
    const colDefs = UldManageConfig.getColumns({
      operation: {
        show: handleShow
      }
    });
    return colDefs;
  }, []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Col span={12}>
          <div style={{ paddingBottom: "8px" }}>{t("ULD")}</div>
          <Form.Item name="codes" wrapperCol={{ span: 22 }} rules={numberRules}>
            <FilterTextArea
              style={{ width: "100%", height: 75, resize: "none" }}
              placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
            />
          </Form.Item>
        </Col>
      </FilterContainer>
      <Container title={t("ULD管理")} wrapperClassName={styles.wrapper} table>
        <Row justify="start" style={{ padding: "0 10px" }}>
          <Button
            className="operation-btn mr-4 mb-4"
            icon={<DeleteOutlined/>}
            onClick={handleDelete}
            disabled={store.selectedRowKeys.length === 0}
          >
            {t("批量删除")}
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
            pageSizeOptions: [50, 100, 200, 500],
            defaultPageSize: 50,
            size: "default",
            onChange: gridStore.onTableChange.bind(gridStore),
          }}
          onChange={gridStore.onCommonTableChange.bind(gridStore)}
        />
      </Container>
      <Modal
        onCancel={handleCancel}
        title={t("图片查看")}
        footer={null}
        visible={ImgVisible}
      >
        <div className={styles.prevImgContainer}>
          <Image.PreviewGroup
            preview={{
              onVisibleChange: (value: boolean) => {
                if (value == false) {
                  setImgVisible(true);
                }
              },
            }}
          >
            {ImgUrl.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt=""
                width={100}
                height={100}
                className={styles.prevImg}
                onClick={() => setImgVisible(false)}
              />
            ))}
          </Image.PreviewGroup>
        </div>
      </Modal>
    </Container>
  )
}

const Template = observer(UldManageComponent);

export default Template;
import { observer } from "mobx-react-lite";
import {
  Button,
  ClientGrid,
  Container,
  EditableCell,
  FilterContainer,
  Form,
  Modal,
  Row,
  SearchSelect,
  Table,
  Dropdown,
  Col,
  Input,
} from "@components";
import styles from "./vendor-info.module.less";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as VendorInfoConfig from "@features/baseinfo/vendor/vendor-info.config.tsx";
import { useStore } from "@hooks";
import { VendorInfoStore } from "@features/baseinfo/vendor/vendor-info.store.ts";
import { useCallback, useEffect, useMemo } from "react";
import { VendorInfoFormValues } from "@features/baseinfo/vendor/vendor-info.type.ts";
import optionsService from "@services/options.service.ts";
import { MenuProps } from "antd";

function VendorInfoComponent() {
  const gridStore = ClientGrid.useGridStore(VendorInfoConfig.getRows, { autoLoad: false });
  const { store, t, navigate, } = useStore(VendorInfoStore, gridStore)(gridStore);

  useEffect(() => {
    store.gridStore.loadData();
  }, [store]);

  const handleFinish = useCallback((values: any = {}) => {
    const { name, vendorType, active } = values;
    gridStore.setQueryParams({ name, type: vendorType, active });
    store.setSelectedRowKeys([]);
  }, []);

  const initialValues: VendorInfoFormValues = useMemo(
    () => ({
      name: "",
      type: 0,
      active: 0,
    }),
    []
  );

  const handleCreate = () => {
    navigate("/baseinfo/vendor/create");
  };

  const handleEdit = useCallback(({ id }: { id: number }) => {
    navigate(`/baseinfo/vendor/edit/${id}`)
  }, []);

  const handleDelete = useCallback(({ id }: { id: number }) => {
    Modal.confirm({
      title: t("操作确认"),
      content: t(
        "警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作。"
      ),
      okText: t("确认删除"),
      cancelText: t("取消"),
      onOk: () => store.delete(id),
    });
  }, []);

  const columns = useMemo(() => {
    const colDefs = VendorInfoConfig.getColumns({
      operation: {
        edit: handleEdit,
        delete: handleDelete,
      },
    });
    return colDefs;
  }, []);

  const items = optionsService.activeDisable
    .filter((item) => item.value !== 0)
    .map((item) => ({ label: item.label, key: item.value })) ?? [];

  const onMenuClick: MenuProps['onClick'] = async (e) => {
    const ids = store.selectedRowKeys;
    if (e.key == '1') {
      await store.setActive(ids, true);
    } else if (e.key == '2') {
      await store.setActive(ids, false);
    }
    store.setSelectedRowKeys([]);
  };

  return (
    <Container className={styles.container} loading={store.loading}>
      <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
        <Row>
          <Form.Item
            name="name"
            label={t("尾程服务商名称")}
            style={{ width: "350px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vendorType"
            label={t("公司类型")}
            style={{ width: "250px" }}
          >
            <SearchSelect
              optionKey="vendorTypes"
            />
          </Form.Item>
          <Form.Item
            name="active"
            label={t("启用状态")}
            style={{ width: "250px" }}
          >
            <SearchSelect
              optionKey="activeDisable"
            />
          </Form.Item>
        </Row>
      </FilterContainer>
      <Container title={t("Vendor信息库")} wrapperClassName={styles.wrapper} table>
        <Row justify="start" style={{ padding: "0 10px" }}>
          <Col>
            <Button
              className="operation-btn mr-4 mb-4"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              {t("新增")}
            </Button>
          </Col>
          <Col>
            <Dropdown.Button
              className="operation-btn mr-4 mb-4"
              icon={<EditOutlined />}
              menu={{ items, onClick: onMenuClick }}
              disabled={store.selectedRowKeys.length === 0}
            >
              {t('启用/禁用')}
            </Dropdown.Button>
          </Col>
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
    </Container>
  );
}

const Template = observer(VendorInfoComponent);

export default Template;
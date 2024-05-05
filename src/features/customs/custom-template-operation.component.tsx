import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Container,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  SubmitButton,
  Switch,
} from "@components";
import { useTranslation } from "@locale";
import { CustomTemplateOperationStore } from "./custom-template-operation.store";
import styles from "./custom-template-operation.module.less";
import { CustomTemplateFormValues } from "./types";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ColumnSelectModal } from "./component/column-select-modal.component";
import { DragableTable } from "./component/dragable-table.component";

interface TemplateOperationComponentProps {
  title: string;
  store: CustomTemplateOperationStore;
}

function TemplateOperationComponent(props: TemplateOperationComponentProps) {
  const { title, store } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue(store.initialValues);
  }, [form, store.initialValues]);

  const handleAddCol = useCallback(() => store.openColumnSelectModal(), []);
  const handleAddCustomCol = useCallback(() => {
    store.addCustomTemplateColumns();
  }, [store]);

  const onFinish = async (values: CustomTemplateFormValues) => {
    await store.handleSubmit(values);
    navigate(-1);
  };

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue(store.initialValues);
    store.resetTemplateColumns();
  };

  return (
    <Container
      className={styles.container}
      title={title}
      loading={store.loading}
      backable
    >
      <ColumnSelectModal
        open={store.isColumnSelectModalOpen}
        onOk={store.handleColumnSelected.bind(store)}
        onCancel={store.closeColumnSelectModal.bind(store)}
        targetKeys={store.columnKeys}
        templateCols={store.templateColumnOptions}
      />
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onReset={onReset}
      >
        <div className={styles.form}>
          <Form.Item name="id" label={t("模板编号")}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="name"
            label={t("模板名称")}
            rules={[{ required: true }]}
          >
            <Input placeholder={t("请填写模板名称")} />
          </Form.Item>
          <Form.Item
            name="type"
            label={t("模板类型")}
            rules={[{ required: true }]}
          >
            <Select options={store.templateTypes} />
          </Form.Item>
          <Form.Item name="active" label={t("是否启用")}>
            <Switch checkedChildren={t("启用")} unCheckedChildren={t("停用")} />
          </Form.Item>
          <Form.Item name="mergeOrderNumber" label={t("按运单号合并商品")}>
            <Radio.Group>
              <Radio value={false}>{t("否")}</Radio>
              <Radio value={true}>{t("是")}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t("导出列配置")}></Form.Item>
        </div>
        <div className="flex flex-col align-middle justify-center mx-20">
          <Row className="mb-3">
            <Button
              icon={<PlusOutlined />}
              className={clsx("operation-btn")}
              onClick={handleAddCol}
            >
              {t("选择/修改导出列")}
            </Button>
            <Button
              icon={<PlusOutlined />}
              className={clsx("operation-btn")}
              onClick={handleAddCustomCol}
            >
              {t("新增自定义")}
            </Button>
          </Row>
          <DragableTable
            dataSource={store.templateColumns}
            handleRecordFieldChange={store.handleRecordFieldChange.bind(store)}
            setDataSource={store.setTemplateColumns.bind(store)}
          />
        </div>
        <Form.Item className="mt-3">
          <div className="flex items-center justify-center">
            <Space size={60}>
              <SubmitButton form={form}>{t("提交")}</SubmitButton>
              <Button htmlType="reset" className="operation-btn">
                {t("重置")}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Container>
  );
}

const TemplateOperation = observer(TemplateOperationComponent);

export default TemplateOperation;

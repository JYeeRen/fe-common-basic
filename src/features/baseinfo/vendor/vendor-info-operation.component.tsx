import { VendorInfoOperationStore } from "@features/baseinfo/vendor/vendor-info-operation.store.ts";
import { useTranslation } from "@locale";
import { Button, Container, Form, Input, Modal, SearchSelect, Space, SubmitButton, Checkbox, Row } from "@components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { VendorInfo } from "@features/baseinfo/vendor/vendor-info.type.ts";
import styles from "@features/baseinfo/vendor/vendor-info-operation.module.less";
import { observer } from "mobx-react-lite";
import optionsService from "@services/options.service.ts";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

interface IVendorInfoOperation {
  title: string;
  store: VendorInfoOperationStore;
}

function VendorInfoOperationComponent(props: IVendorInfoOperation) {
  const { title, store } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue(store.initialValues);
  }, [form, store.initialValues]);

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue(store.initialValues);
  };

  const handleFinish = async (values: VendorInfo) => {
    await store.handleSubmit(values);
    navigate(-1);
  };

  const handleBack = () => {
    Modal.confirm({
      title: t('操作确认'),
      content: t('您所作的更改可能未保存，是否离开该页面。'),
      okText: t('确认离开'),
      cancelText: t('留在当前页面'),
      onOk: () => {
        navigate(-1);
      },
    });
  };

  const checkValidate = () => {
    return Promise.resolve();
  }

  return (
    <Container
      className={styles.container}
      title={title}
      loading={store.loading}
      backable
      onBack={handleBack}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        form={form}
        className={styles.form}
        onFinish={handleFinish}
        onReset={onReset}
      >
        <Form.Item
          label={t("公司名称")}
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("请填写") + t("公司名称")} />
        </Form.Item>
        <Form.Item
          label={t("地址")}
          name="address"
        >
          <Input placeholder={t("请填写") + t("地址")} />
        </Form.Item>
        <Form.Item
          label={t("联系方式")}
          name="contactDetails"
        >
          <Input placeholder={t("请填写") + t("联系方式")} />
        </Form.Item>
        <Form.Item
          label={t("邮箱")}
          name="email"
        >
          <Input placeholder={t("请填写") + t("邮箱")} />
        </Form.Item>
        <Form.Item
          label={t("公司类型")}
          name="typeList"
          rules={[{ required: true }]}
        >
          <Checkbox.Group options={optionsService.vendorTypes.filter(option => option.value !== 0)} />
        </Form.Item>
        <Form.Item
          label={t("尾程商子名称")}
          name="tailProviders"
          rules={[{ required: true, validator: checkValidate }]}
        >
          <Form.List
            name="tailProviders"
            rules={[
              {
                validator: async (_, providers) => {
                  if (!providers || providers.length < 1) {
                    return Promise.reject(new Error(t('请添加至少一条子名称')));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                <Row>
                  <Button icon={<PlusOutlined />} type="primary" onClick={() => add()} block
                          style={{ width: "120px", marginBottom: "10px" }}>
                    {t('添加一条')}
                  </Button>
                  <p
                    className={styles.tips}>{t('注意: 尾程商本名也请添加一条对应的子名称。如: 公司名称UPS, 请添加一个子名称为UPS。不区分大小写。')}</p>
                </Row>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex' }} align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name]}
                      rules={[{ required: true, message: t("请填写") + t("尾程商子名称") }]}
                    >
                      <Input placeholder={t('子名称') + index} />
                    </Form.Item>
                    <Button icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                    </Button>
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label={t("落地口岸")}
          name="portCode"
          rules={[{ required: true }]}
        >
          <SearchSelect
            optionKey="portCodes"
          />
        </Form.Item>
        <Form.Item
          label={t("备注")}
          name="remarks"
        >
          <TextArea rows={4} maxLength={5000} showCount />
        </Form.Item>
        <Form.Item>
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

const VendorInfoOperation = observer(VendorInfoOperationComponent);

export default VendorInfoOperation;
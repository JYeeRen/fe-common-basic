import { ProblemModalStore } from "@features/warehouse/exception/problem-modal.store.ts";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@locale";
import { Button, Container, DatePicker, Form, Input, Modal, SearchSelect } from "@components";
import styles from "@features/warehouse/prediction/prediction-operation.module.less";
import { useEffect } from "react";
import { dayjs } from "@infra";

interface IProblemCreateModal {
  store: ProblemModalStore,
  handleConfirm: () => void,
}

export const ProblemCreateModalComponent = observer((props: IProblemCreateModal) => {
  const { store, handleConfirm } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (store.issueData) {
      console.log(store.issueData);
      const values = JSON.parse(JSON.stringify(store.issueData));
      if (values.ata) {
        values.ata = dayjs(values.ata);
      }
      form.setFieldsValue(values);
    }
  }, [form, store.issueData]);

  const handleCancel = () => {
    store.hideCreateModal();
  };

  const handleFinish = async () => {
    const {
      masterWaybillNo,
      bigBagNo,
      tailProviderId,
      customerName,
      ata,
    } = form.getFieldsValue();
    const formData = {
      issueId: store.issueData!.id,
      masterWaybillNo,
      bigBagNo,
      tailProviderId,
      customerName,
      ata: dayjs(ata).format(),
    };
    await store.doCreateAndLink(formData);
    store.hideCreateModal();
    handleConfirm();
  };

  return (
    <Modal
      open={store.createModalVisible}
      title={t("关联包裹")}
      width={'50%'}
      destroyOnClose
      onCancel={handleCancel}
      maskClosable={false}
      footer={null}
      afterClose={form.resetFields}
    >
      <Container
        className={styles.container}
        title={t("新增入库包裹")}
        loading={store.loading}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          form={form}
          className={styles.form}
          onFinish={handleFinish}
        >
          <Form.Item
            label={t("提单号")}
            name="masterWaybillNo"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("请填写提单号")}/>
          </Form.Item>
          <Form.Item
            label={t("袋号")}
            name="bigBagNo"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("请填写袋号")}/>
          </Form.Item>
          <Form.Item
            label={t("尾程服务商名称")}
            name="tailProviderId"
            rules={[{ required: true }]}
          >
            <SearchSelect
              optionKey="trailProviders"
            />
          </Form.Item>
          <Form.Item
            label={t("客户名称")}
            name="customerName"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("请填写") + t("客户名称")}/>
          </Form.Item>
          <Form.Item
            label={t("到港时间")}
            name="ata"
          >
            <DatePicker
              showTime
              style={{ marginLeft: "10px" }}
            />
          </Form.Item>
          <Form.Item
            label={t("入库口岸")}
            name="arrivePortCode"
            rules={[{ required: true }]}
          >
            <Input disabled/>
          </Form.Item>
          <Form.Item>
            <span style={{ color: "red" }}>{t("所选问题件由此口岸录入，此字段不可修改")}</span>
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              await handleFinish();
            }}
          >
            {t('提交并关联')}
          </Button>
        </div>
      </Container>
    </Modal>
  );
});
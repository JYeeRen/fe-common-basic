import { useTranslation } from "@locale";
import { Button, Form, Input, Modal, ModalProps, Row, SubmitButton } from "@components";

export function CreateModal(props: ModalProps & { onCreate: (email: string) => Promise<void> }) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const { open, onOk, onCreate, onCancel, ...resetProps } = props;

  const handleFinish = () => {
    const { email } = form.getFieldsValue();
    onCreate(email);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <Modal
      open={open}
      title={t("新增邮箱")}
      footer={null}
      maskClosable={false}
      width={600}
      onCancel={onCancel}
      destroyOnClose
      {...resetProps}
    >
      <Form style={{ marginTop: '30px' }} form={form}>
        <Form.Item
          name="email"
          label={t('邮箱')}
          labelCol={{ span: 0 }}
          rules={[
            {
              required: true
            },
            {
              pattern: emailRegex,
              message: t('邮箱格式不正确'),
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Row justify="end" className="my-4">
          <Button
            className="mr-4"
            onClick={onCancel}
          >
            {t("取消")}
          </Button>
          <SubmitButton form={form} onClick={handleFinish}>
            {t("确定")}
          </SubmitButton>
        </Row>
      </Form>
    </Modal>
  );
}

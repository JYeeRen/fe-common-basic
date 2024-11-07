import { useTranslation } from "@locale";
import { Button, Checkbox, Form, Modal, ModalProps, Row, SubmitButton } from "@components";
import optionsService from "@services/options.service";

export function SetModal(props: ModalProps & { onSave: (types: number[]) => Promise<void> }) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const { open, onSave, onCancel, ...resetProps } = props;

  const handleFinish = () => {
    const { types } = form.getFieldsValue();
    onSave(types);
  }

  return (
    <Modal
      open={open}
      title={t("配置邮件权限")}
      footer={null}
      maskClosable={false}
      width={600}
      onCancel={onCancel}
      destroyOnClose
      {...resetProps}
    >
      <Form style={{ marginTop: '30px' }} form={form} layout="vertical">
        <Form.Item
          name="types"
          label={t('可接收邮件类型')}
          rules={[{ required: true }]}
        >
          <Checkbox.Group>
            {optionsService.subscriptionEmailTypes.map(({ label, value }) => (
              <Checkbox key={value} value={value}>{label}</Checkbox>
            ))}
          </Checkbox.Group>
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

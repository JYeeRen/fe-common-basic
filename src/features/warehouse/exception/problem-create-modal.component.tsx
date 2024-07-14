import {ProblemModalStore} from "@features/warehouse/exception/problem-modal.store.ts";
import {observer} from "mobx-react-lite";
import {useTranslation} from "@locale";
import {Button, Container, Form, Input, Modal} from "@components";
import styles from "@features/warehouse/prediction/prediction-operation.module.less";

interface IProblemCreateModal {
    store: ProblemModalStore,
    handleConfirm: () => void,
}

export const ProblemCreateModalComponent = observer((props: IProblemCreateModal) => {
    const {store, handleConfirm} = props;
    const [t] = useTranslation();
    const [form] = Form.useForm();

    const handleCancel = () => {
        store.hideCreateModal();
    };

    const handleFinish = async () => {
        const {
            masterWaybillNo,
            bigBagNo,
            tailProviderName,
        } = form.getFieldsValue();
        const formData = {
            issueId: store.issueId,
            masterWaybillNo,
            bigBagNo,
            tailProviderName,
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
                    labelCol={{span: 5}}
                    wrapperCol={{span: 15}}
                    form={form}
                    className={styles.form}
                    onFinish={handleFinish}
                >
                    <Form.Item
                        label={t("提单号")}
                        name="masterWaybillNo"
                        rules={[{required: true}]}
                    >
                        <Input placeholder={t("请填写提单号")}/>
                    </Form.Item>
                    <Form.Item
                        label={t("袋号")}
                        name="bigBagNo"
                        rules={[{required: true}]}
                    >
                        <Input placeholder={t("请填写袋号")}/>
                    </Form.Item>
                    <Form.Item
                        label={t("尾程服务商名称")}
                        name="tailProviderName"
                        rules={[{required: true}]}
                    >
                        <Input placeholder={t("请填写尾程服务商名称")}/>
                    </Form.Item>
                </Form>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
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
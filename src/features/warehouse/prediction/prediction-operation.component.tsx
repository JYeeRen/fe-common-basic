import {
    Block,
    Button,
    Container,
    Form,
    Input,
    Modal,
    Space,
    SubmitButton,
} from "@components";
import {useTranslation} from "@locale";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {PredictionOperationStore} from "@features/warehouse/prediction/prediction-operation.store.ts";
import {WarehouseReceipt} from "@features/warehouse/prediction/type.ts";
import styles from "./prediction-operation.module.less";
import {observer} from "mobx-react-lite";

interface IPredictionOperation {
    title: string;
    store: PredictionOperationStore;
}

function PredictionOperationComponent(props: IPredictionOperation) {
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

    const handleFinish = async (values: WarehouseReceipt) => {
        await store.handleSubmit(values);
        navigate(-1);
    };

    const handleBack = () => {
        const {
            masterWaybillNo,
            bigBagNo,
            tailProviderName,
        } = form.getFieldsValue();
        if (store.isFieldChanged({
            masterWaybillNo,
            bigBagNo,
            tailProviderName,
        })) {
            Modal.confirm({
                title: t('操作确认'),
                content: t('您所作的更改可能未保存，是否离开该页面。'),
                okText: t('确认离开'),
                cancelText: t('留在当前页面'),
                onOk: () => {
                    navigate(-1);
                },
            });
        } else {
            navigate(-1);
        }
    };

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
                    label={t("提单号")}
                    name="masterWaybillNo"
                    rules={[{ required: true }]}
                >
                    <Input placeholder={t("请填写提单号")} disabled={!!store.id} />
                </Form.Item>
                <Form.Item
                    label={t("袋号")}
                    name="bigBagNo"
                    rules={[{ required: true }]}
                >
                    <Input placeholder={t("请填写袋号")} disabled={!!store.id}/>
                </Form.Item>
                <Form.Item
                    label={t("尾程服务商名称")}
                    name="tailProviderName"
                    rules={[{ required: true }]}
                >
                    <Input placeholder={t("请填写尾程服务商名称")} />
                </Form.Item>
                <Block if={!!store.id}>
                    <Form.Item>
                        <span className={styles.tips}>
                            {t("注：提单号和袋号不可修改，若数据错误，请删除后重新录入。")}
                        </span>
                    </Form.Item>
                </Block>
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

const PredictionOperation = observer(PredictionOperationComponent);

export default PredictionOperation;
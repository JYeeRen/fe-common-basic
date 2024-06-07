import {Button, FileUpload, Form, Modal, Row, SubmitButton} from "@components";
import {observer} from "mobx-react-lite";
import {PredictionStore} from "@features/warehouse/prediction/prediction.store.ts";
import {useTranslation} from "@locale";
import {useCallback} from "react";
import {UploadRes} from "@features/trajectory/bill-of-lading/type.ts";
import {uniq} from "lodash";

interface IPredictionUpload {
    store: PredictionStore;
    refreshTable: () => void;
}

export const PredictionUploadModal = observer((props: IPredictionUpload) => {
    const { store, refreshTable } = props;
    const [t] = useTranslation();
    const [form] = Form.useForm();

    const onOk = async () => {
        const { file } = form.getFieldsValue();

        const formdata = new FormData();
        formdata.append("file", file[0].originFileObj);

        const uploadRes = await store.uploadTemplate(formdata);
        store.hideUploadModal();
        operationConfirm(uploadRes);
    };

    const operationConfirm = useCallback((res: UploadRes) => {
        const { failed, total, success } = res;
        Modal.confirm({
            okText: t('确认'),
            cancelText: t('复制未完成单号'),
            title: t("操作确认"),
            onOk: () => {
                refreshTable();
            },
            onCancel: async () => {
                await navigator.clipboard.writeText(
                    uniq(failed.map((i) => i.number)).join("\n")
                );
            },
            content: (
                <>
                    <p style={{ color: "#c7c7c7" }}>
                        {t("全部上传数据：{{n}}条。", { n: total })}
                    </p>
                    <p style={{ color: "#c7c7c7" }}>
                        {t("完成上传数据：{{n1}}条。未上传数据：{{n2}}条。", {
                            n1: success,
                            n2: total - success,
                        })}
                    </p>
                    <p style={{ color: "#c7c7c7" }}>{t("未完成数据提单号如下：")}</p>
                    {failed.map((item, index) => (
                        <p key={`${index}_${item.number}`} style={{ color: "#c7c7c7" }}>
                            {item.number}
                        </p>
                    ))}
                </>
            ),
        });
    }, []);

    const onCancel = () => {
        store.hideUploadModal();
    };

    return (
        <Modal
            open={store.uploadModalVisible}
            title={t("文件上传")}
            width={550}
            destroyOnClose
            onCancel={onCancel}
            maskClosable={false}
            footer={null}
            afterClose={form.resetFields}
        >
            <Form form={form}>
                <div className="my-10">
                    <Form.Item noStyle name="file" rules={[{ required: true }]}>
                        <FileUpload
                            title={<span className="mr-4">{t("请上传附件")}:</span>}
                            maxCount={1}
                        />
                    </Form.Item>
                    <div style={{ display: "inline-block", color: "orange" }}>
                        {t("注意：")}
                    </div>
                    <p>
                        {t("请确保上传的表格数据表头字段正确。")}（
                        <a
                            style={{
                                color: "#1677ff",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={store.downloadTemplate.bind(store)}
                        >
                            {t("点击可下载模板进行制作。")}
                        </a>
                        ）
                    </p>
                </div>
                <Row justify="end" className="my-4">
                    <Button className="mr-4" onClick={onCancel}>
                        {t("取消")}
                    </Button>
                    <SubmitButton form={form} onClick={onOk} loading={store.loading}>
                        {t("确认无误，提交文件")}
                    </SubmitButton>
                </Row>
            </Form>
        </Modal>
    );
});
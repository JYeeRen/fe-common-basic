import {Button, FileUpload, Form, Modal, Row, SubmitButton} from "@components";
import {observer} from "mobx-react-lite";
import {PredictionStore} from "@features/warehouse/prediction/prediction.store.ts";
import {useTranslation} from "@locale";
import {useCallback} from "react";
import {UploadRes} from "./type.ts";
import {uniq} from "lodash";
import {Table} from "antd";
import {CopyToClipboard} from "react-copy-to-clipboard";

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
        const columns = [
            {
                title: t('提单号'),
                dataIndex: 'masterWaybillNo',
                key: 'masterWaybillNo',
            },
            {
                title: t('袋号'),
                dataIndex: 'bigBagNo',
                key: 'bigBagNo',
            },
            {
                title: t('原因'),
                dataIndex: 'reason',
                key: 'reason',
            },
        ];
        const modal = Modal.confirm({
            width: '50%',
            title: t("操作确认"),
            footer: (
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <CopyToClipboard text={uniq(failed.map((i) => i.bigBagNo)).join("\n")}>
                        <Button
                            key="back"
                            onClick={() => {
                                modal.destroy()
                            }}
                            style={{marginRight: '10px'}} // 添加右边距
                        >
                            {t('复制未完成袋号')}
                        </Button>
                    </CopyToClipboard>
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                            refreshTable();
                            modal.destroy();
                        }}
                    >
                        {t('确认')}
                    </Button>
                </div>
            ),
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
                    <p style={{ color: "#c7c7c7" }}>{t("未完成数据袋号如下：")}</p>
                    <Table dataSource={failed} columns={columns} bordered={true} pagination={{pageSize: 5}}/>
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
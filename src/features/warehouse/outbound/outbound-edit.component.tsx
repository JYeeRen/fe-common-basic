import {OutboundStore} from "@features/warehouse/outbound/outbound.store.ts";
import {observer} from "mobx-react-lite";
import {useTranslation} from "@locale";
import {Button, DatePicker, Form, Modal, Row, SearchSelect, Space, SubmitButton, Col} from "@components";
import {convertDate} from "@infra";

interface IOutboundEdit {
    store: OutboundStore;
    refreshTable: () => void;
}

export const OutboundEditModal = observer((props: IOutboundEdit) => {
    const {store, refreshTable} = props;
    const [t] = useTranslation();
    const [form] = Form.useForm();

    const onOk = async () => {
        const {date} = form.getFieldsValue();
        const receiptTime = date ? convertDate(date, Intl.DateTimeFormat().resolvedOptions().timeZone).format(
            "YYYY-MM-DDTHH:mm:ssZ"
        ) : "";
        const formData = {
            id: 0,
            receiptTime: ""
        };
        formData.id = store.currentSelectId;
        formData.receiptTime = receiptTime;
        await store.editTime(formData);
        store.hideEditModal();
        refreshTable();
    }

    const onCancel = () => {
        store.hideEditModal();
    };

    return (
        <Modal
            open={store.editModalVisible}
            title={t("时间录入")}
            width={550}
            destroyOnClose
            onCancel={onCancel}
            maskClosable={false}
            footer={null}
            afterClose={form.resetFields}
        >
            <Form form={form} style={{marginTop: "30px"}}>
                <Col span={12}>
                    <Form.Item
                        label={t("入库时间")}
                        labelAlign="right"
                        labelCol={{span: 7}}
                        wrapperCol={{span: 14}}
                    >
                        <Space.Compact>
                            <Form.Item name="timezone" noStyle>
                                <SearchSelect
                                    disabled
                                    optionKey="timeZones"
                                    placeholder={t("系统时区")}
                                    style={{width: "100px"}}
                                />
                            </Form.Item>
                            <Form.Item name="date" noStyle>
                                <DatePicker
                                    showTime
                                    style={{width: "250px"}}
                                    placeholder={t("请选择时间")}
                                />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </Col>
                <Row justify="end" className="my-4">
                    <Button className="mr-4" onClick={onCancel}>
                        {t("取消")}
                    </Button>
                    <SubmitButton form={form} onClick={onOk} loading={store.loading}>
                        {t("确认")}
                    </SubmitButton>
                </Row>
            </Form>
        </Modal>
    );
});
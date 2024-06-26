import {PalletInfoStore} from "@features/warehouse/pallet/pallet-info.store.ts";
import {observer} from "mobx-react-lite";
import {useTranslation} from "@locale";
import {Button, Col, Form, Modal, Row, SubmitButton, InputNumber} from "@components";
import dayjs from "dayjs";

interface IPalletInfoAdd {
    store: PalletInfoStore;
    refreshTable: () => void;
}

export const PalletInfoAddModal = observer((props: IPalletInfoAdd) => {
    const {store, refreshTable} = props;
    const [t] = useTranslation();
    const [form] = Form.useForm();

    const onOk = async () => {
        const {palletNum} = form.getFieldsValue();
        const formData = {
            date: "",
            count: 0
        };
        formData.date = dayjs().format("YYYY-MM-DDTHH:mm:ssZ");
        formData.count = palletNum;
        await store.addPallets(formData);
        store.hideAddModal();
        refreshTable();
    }

    const onCancel = () => {
        store.hideAddModal();
    };

    return (
        <Modal
            open={store.addModelVisible}
            title={t("新增托盘")}
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
                        label={t("生成托盘数量")}
                        name="palletNum"
                        rules={[{required: true}]}
                    >
                        <InputNumber min={1} max={9999} placeholder={"0-9999"} style={{width: "200px"}}/>
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
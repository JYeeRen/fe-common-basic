import {observer} from "mobx-react-lite";
import {
    ClientGrid,
    Container,
    Row,
    Col, EditableCell, Table, Button, Form, Space, SearchSelect, DatePicker, Input, SubmitButton, Modal
} from "@components";
import styles from "@features/warehouse/prediction/prediction-operation.module.less";
import * as PredictionAddConfig from "@features/warehouse/prediction/prediction-add-config.tsx";
import {useStore} from "@hooks";
import {PredictionStore} from "@features/warehouse/prediction/prediction.store.ts";
import {useEffect, useMemo} from "react";
import dayjs from "dayjs";
import {isEqual} from "lodash";

const PredictionAddComponent = observer(() => {
    const gridStore = ClientGrid.useGridStore(PredictionAddConfig.getRows, {autoLoad: false});
    const {store, t, navigate} = useStore(PredictionStore, gridStore)(gridStore);
    const [form] = Form.useForm();

    useEffect(() => {
        gridStore.setQueryParams({noType: 2});
        form.setFieldsValue(initialValues);
    }, [store, form]);

    const columns = useMemo(() => {
        const colDefs = PredictionAddConfig.getColumns();
        return colDefs;
    }, []);

    const initialValues = {
        receiptTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        receiptTimeData: dayjs(),
        palletCode: '',
    };

    const isFieldChanged = (formValues: {
        receiptTimeZone: string,
        receiptTimeData: any,
        palletCode: string,
    }) => {
        if (!isEqual(formValues, initialValues)) {
            return true;
        }
    };

    const handleBack = () => {
        const {
            receiptTimeZone,
            receiptTimeData,
            palletCode,
        } = form.getFieldsValue();

        if (isFieldChanged({receiptTimeZone, receiptTimeData, palletCode})) {
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

    const onConfirm = () => {

    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue(initialValues);
        store.setSelectedRowKeys([]);
    };

    return (
        <Container
            className={styles.container}
            title={t('手动入库信息完善')}
            loading={store.loading}
            backable
            onBack={handleBack}>
            <Col>
                <Row>
                    <Col span={12}>
                        <Container title={t("选中的待入库包裹列表")}>
                            <Table
                                components={{body: {cell: EditableCell}}}
                                widthFit
                                bordered
                                loading={gridStore.loading}
                                rowSelection={{
                                    hideSelectAll: true,
                                    type: "checkbox",
                                    onChange: (keys) => store.setSelectedRowKeys(keys as number[]),
                                    selectedRowKeys: store.selectedRowKeys,
                                }}
                                rowKey="id"
                                dataSource={gridStore.rowData}
                                columns={columns}
                                size="small"
                                pagination={{
                                    total: gridStore.total,
                                    pageSize: gridStore.pageSize,
                                    current: gridStore.page,
                                    showTotal: (total) => t("共{{total}}条", {total}),
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                    pageSizeOptions: [10, 30, 50, 100, 200, 500],
                                    defaultPageSize: 50,
                                    size: "default",
                                    onChange: gridStore.onTableChange.bind(gridStore),
                                }}
                            />
                        </Container>
                    </Col>
                    <Col span={12}>
                        <Container title={t("请完善包裹信息")}>
                            <Form
                                labelCol={{span: 4}}
                                wrapperCol={{span: 14}}
                                form={form}
                                className={styles.form}
                                onFinish={onConfirm}>
                                <Form.Item
                                    label={t("入库时间")}
                                    name="receiptTimeData"
                                    rules={[{required: true}]}
                                >
                                    <Space.Compact>
                                        <Form.Item name="receiptTimeZone" noStyle>
                                            <SearchSelect
                                                optionKey="timeZones"
                                                placeholder={t("选择时区")}
                                                style={{width: "200px"}}
                                            />
                                        </Form.Item>
                                        <Form.Item name="receiptTimeData" noStyle>
                                            <DatePicker
                                                showTime
                                                style={{width: "300px"}}
                                                placeholder={t("请选择时间")}
                                            />
                                        </Form.Item>
                                    </Space.Compact>
                                </Form.Item>
                                <Form.Item
                                    label={t("托盘码")}
                                    name="palletCode"
                                    rules={[{required: true}]}
                                >
                                    <Input placeholder={t("托盘码")}/>
                                </Form.Item>
                            </Form>
                        </Container>
                    </Col>
                </Row>
                <Row justify="end" className="my-4">
                    <SubmitButton form={form} style={{marginRight: "8px"}}>
                        {t("提交")}
                    </SubmitButton>
                    <Button className="mr-4" onClick={onReset}>
                        {t("重置")}
                    </Button>
                </Row>
            </Col>
        </Container>
    );
})

export default PredictionAddComponent;
import {observer} from "mobx-react-lite";
import {
    Button,
    ClientGrid,
    Col, Container, DatePicker, EditableCell,
    FilterContainer,
    FilterTextArea,
    Form, Row,
    SearchSelect,
    Space, Table,
    textareaMaxLengthRule
} from "@components";
import * as PalletInfoConfig from "./pallet-info-config.tsx";
import {useStore} from "@hooks";
import {PalletInfoStore} from "./pallet-info.store.ts";
import {useCallback, useEffect, useMemo} from "react";
import {convertDate} from "@infra";
import {compact} from "lodash";
import {WarehouseOutboundFormValues} from "@features/warehouse/outbound/type.ts";
import styles from "./pallet-info.module.less";
import {PrinterOutlined, PlusOutlined} from "@ant-design/icons";
import {PalletInfoAddModal} from "@features/warehouse/pallet/pallet-info-add.component.tsx";
import {PalletInfo} from "@features/warehouse/pallet/type.ts";

function PalletInfoComponent() {
    const gridStore = ClientGrid.useGridStore(PalletInfoConfig.getRows, {autoLoad: false});
    const {store, t} = useStore(PalletInfoStore, gridStore)(gridStore);

    useEffect(() => {
        store.gridStore.loadData();
    }, [store]);

    const handleFinish = useCallback((values: any = {}) => {
        const {codes, timezone, formDate} = values;
        const date = {
            zone: timezone,
            start: formDate && formDate.length > 0 ? convertDate(formDate[0], timezone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
            end: formDate && formDate.length > 0 ? convertDate(formDate[1], timezone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
        };
        gridStore.setQueryParams({codes: compact(codes), date});
    }, []);

    const handlePrint = async (value: PalletInfo) => {
        await store.printPallets([value.id]);
    };

    const handleBatchPrint = async () => {
        await store.printPallets(store.selectedRowKeys);
    };

    const handleAdd = () => {
        store.showAddModal();
    };

    const initialValues: WarehouseOutboundFormValues = useMemo(
        () => ({
            codes: [],
            date: {
                zone: "",
                start: "",
                end: ""
            }
        }),
        []
    );

    const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

    const columns = useMemo(() => {
        const colDefs = PalletInfoConfig.getColumns({
            operation: {
                print: handlePrint
            }
        });
        return colDefs;
    }, []);

    return (
        <Container className={styles.container} loading={store.loading}>
            <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
                <Col span={7}>
                    <div style={{paddingBottom: "8px"}}>{t("托盘码")}</div>
                    <Form.Item name="codes" wrapperCol={{span: 22}} rules={numberRules}>
                        <FilterTextArea
                            style={{width: "100%", height: 75, resize: "none"}}
                            placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("托盘码生成日期")}
                        labelAlign="right"
                        labelCol={{span: 5}}
                        wrapperCol={{span: 10}}
                    >
                        <Space.Compact>
                            <Form.Item name="timezone" noStyle>
                                <SearchSelect
                                    optionKey="timeZones"
                                    placeholder={t("选择时区")}
                                    style={{width: "200px"}}
                                />
                            </Form.Item>
                            <Form.Item name="formDate" noStyle>
                                <DatePicker.RangePicker
                                    style={{width: "300px"}}
                                    placeholder={[t("请选择起始日期"), t("请选择结束日期")]}
                                />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </Col>
            </FilterContainer>
            <Container title={t("托盘管理")} wrapperClassName={styles.wrapper} table>
                <Row justify="start" style={{padding: "0 10px"}}>
                    <Button
                        className="operation-btn mr-4 mb-4"
                        icon={<PlusOutlined/>}
                        onClick={handleAdd}
                    >
                        {t("生成托盘")}
                    </Button>
                    <Button
                        className="operation-btn mr-4 mb-4"
                        icon={<PrinterOutlined/>}
                        disabled={store.selectedRowKeys.length === 0}
                        onClick={handleBatchPrint}
                    >
                        {t("批量打印已选项")}
                    </Button>
                </Row>
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
                    onChange={gridStore.onCommonTableChange.bind(gridStore)}
                />
            </Container>
            <PalletInfoAddModal
                store={store}
                refreshTable={gridStore.loadData.bind(gridStore)}
            />
        </Container>
    );
}

const Template = observer(PalletInfoComponent);

export default Template;
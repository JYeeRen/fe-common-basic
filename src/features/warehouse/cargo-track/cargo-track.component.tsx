import {
    ClientGrid,
    Col,
    Row,
    Container,
    EditableCell,
    FilterContainer,
    FilterTextArea,
    Form,
    Radio, SearchSelect,
    Table, textareaMaxLengthRule, Space, DatePicker, Button
} from "@components";
import styles from "./cargo-track.module.less";
import optionsService from "@services/options.service.ts";
import * as CargoTrackConfig from "./cargo-track-config.tsx";
import {useStore} from "@hooks";
import {useCallback, useEffect, useMemo} from "react";
import {compact} from "lodash";
import {WarehouseCargoTrackFormValues} from "@features/warehouse/prediction/type.ts";
import {observer} from "mobx-react-lite";
import {CargoTrackStore} from "@features/warehouse/cargo-track/cargo-track.store.ts";
import {convertDate} from "@infra";
import {CloudDownloadOutlined} from "@ant-design/icons";

function CargoTrackComponent() {
    const gridStore = ClientGrid.useGridStore(CargoTrackConfig.getRows, {autoLoad: false});
    const {store, t} = useStore(CargoTrackStore, gridStore)(gridStore);

    useEffect(() => {
        store.gridStore.loadData();
    }, [store]);

    const handleFinish = useCallback((values: any = {}) => {
        const {
            noList,
            noType,
            receiptStatus,
            deductionStatus,
            receiptTimeZone,
            receiptTimeData,
            outboundTimeZone,
            outboundTimeData
        } = values;

        const receiptTime = {
            zone: receiptTimeZone,
            start: receiptTimeData && receiptTimeData.length > 0 ? convertDate(receiptTimeData[0], receiptTimeZone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
            end: receiptTimeData && receiptTimeData.length > 0 ? convertDate(receiptTimeData[1], receiptTimeZone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
        };

        const outboundTime = {
            zone: outboundTimeZone,
            start: outboundTimeData && outboundTimeData.length > 0 ? convertDate(outboundTimeData[0], outboundTimeZone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
            end: outboundTimeData && outboundTimeData.length > 0 ? convertDate(outboundTimeData[1], outboundTimeZone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
        };

        gridStore.setQueryParams({
            noList: compact(noList),
            noType,
            receiptStatus,
            deductionStatus,
            receiptTime,
            outboundTime
        });
    }, []);

    const initialValues: WarehouseCargoTrackFormValues = useMemo(
        () => ({
            noList: [],
            noType: 0,
            receiptStatus: 0,
            deductionStatus: 0,
            receiptTime: {
                zone: "",
                start: "",
                end: ""
            },
            outboundTime: {
                zone: "",
                start: "",
                end: ""
            }
        }),
        []
    );

    const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

    const columns = useMemo(() => {
        const colDefs = CargoTrackConfig.getColumns({
            receiptStatusTypes: optionsService.receiptStatusTypes,
            deductionStatusTypes: optionsService.deductionStatusTypes,
        });
        return colDefs;
    }, [optionsService.receiptStatusTypes, optionsService.deductionStatusTypes]);

    return (
        <Container className={styles.container} loading={store.loading}>
            <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
                <Col span={7}>
                    <div style={{paddingBottom: "8px"}}>
                        <Form.Item noStyle name="noType">
                            <Radio.Group>
                                {optionsService.receiptNoTypes.map((opt) => (
                                    <Radio key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <Form.Item name="noList" wrapperCol={{span: 22}} rules={numberRules}>
                        <FilterTextArea
                            style={{width: "100%", height: 75, resize: "none"}}
                            placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Row justify="center">
                        <Form.Item name="receiptStatus" label={t("货物状态")} style={{paddingRight: "8px"}}>
                            <SearchSelect optionKey="receiptStatusTypes" style={{width: "150px"}}/>
                        </Form.Item>
                        <Form.Item name="deductionStatus" label={t("扣货标记")}>
                            <SearchSelect optionKey="deductionStatusTypes" style={{width: "150px"}}/>
                        </Form.Item>
                    </Row>
                    <Form.Item
                        label={t("入库时间")}
                        labelAlign="right"
                        labelCol={{span: 5}}
                        wrapperCol={{span: 10}}
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
                                <DatePicker.RangePicker
                                    showTime
                                    style={{width: "300px"}}
                                    placeholder={[t("开始日期时间"), t("结束日期时间")]}
                                />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item
                        label={t("出库时间")}
                        labelAlign="right"
                        labelCol={{span: 5}}
                        wrapperCol={{span: 10}}
                    >
                        <Space.Compact>
                            <Form.Item name="outboundTimeZone" noStyle>
                                <SearchSelect
                                    optionKey="timeZones"
                                    placeholder={t("选择时区")}
                                    style={{width: "200px"}}
                                />
                            </Form.Item>
                            <Form.Item name="outboundTimeData" noStyle>
                                <DatePicker.RangePicker
                                    showTime
                                    style={{width: "300px"}}
                                    placeholder={[t("开始日期时间"), t("结束日期时间")]}
                                />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </Col>
            </FilterContainer>
            <Container title={t("货物查询")} wrapperClassName={styles.wrapper} table>
                <Row justify="end" style={{padding: "0 10px"}}>
                    <Button
                        className="operation-btn mr-4 mb-4"
                        icon={<CloudDownloadOutlined/>}
                        onClick={store.export.bind(store, gridStore.queryParams as any)}
                    >
                        {t("导出已筛选数据")}
                    </Button>
                </Row>
                <Table
                    components={{body: {cell: EditableCell}}}
                    widthFit
                    bordered
                    loading={gridStore.loading}
                    // rowSelection={{
                    //     hideSelectAll: true,
                    //     type: "checkbox",
                    //     onChange: (keys) => store.setSelectedRowKeys(keys as number[]),
                    //     selectedRowKeys: store.selectedRowKeys,
                    // }}
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
        </Container>
    );
}

const Template = observer(CargoTrackComponent);

export default Template;
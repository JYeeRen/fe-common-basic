import {observer} from "mobx-react-lite";
import {
    ClientGrid,
    Col, Container, DatePicker, EditableCell,
    FilterContainer,
    FilterTextArea,
    Form,
    Radio, SearchSelect, Space,
    Table,
    textareaMaxLengthRule
} from "@components";
import * as OutboundConfig from "./outbound-config.tsx";
import {useStore} from "@hooks";
import {OutboundStore} from "./outbound.store.ts";
import {useCallback, useEffect, useMemo} from "react";
import {compact} from "lodash";
import optionsService from "@services/options.service.ts";
import {WarehouseOutbound, WarehouseOutboundFormValues} from "@features/warehouse/outbound/type.ts";
import styles from "./outbound.module.less";
import {convertDate} from "@infra";
import {OutboundEditModal} from "@features/warehouse/outbound/outbound-edit.component.tsx";

function OutboundComponent() {
    const gridStore = ClientGrid.useGridStore(OutboundConfig.getRows, {autoLoad: false});
    const {store, t} = useStore(OutboundStore, gridStore)(gridStore);

    useEffect(() => {
        store.gridStore.loadData();
    }, [store]);

    const handleFinish = useCallback((values: any = {}) => {
        const {noList, noType, timezone, date} = values;
        const receiptTime = {
            zone: timezone,
            start: date && date.length > 0 ? convertDate(date[0], timezone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
            end: date && date.length > 0 ? convertDate(date[1], timezone).format(
                "YYYY-MM-DDTHH:mm:ssZ"
            ) : "",
        };
        gridStore.setQueryParams({noList: compact(noList), noType, receiptTime});
    }, []);

    const handleEdit = (value: WarehouseOutbound) => {
        store.currentSelectId = value.id;
        store.showEditModal();
    };

    const initialValues: WarehouseOutboundFormValues = useMemo(
        () => ({
            noList: [],
            noType: 0,
            receiptTime: {
                zone: "",
                start: "",
                end: ""
            }
        }),
        []
    );

    const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

    const columns = useMemo(() => {
        const colDefs = OutboundConfig.getColumns({
            receiptStatusTypes: optionsService.receiptStatusTypes,
            operation: {
                edit: handleEdit
            }
        });
        return colDefs;
    }, [optionsService.receiptStatusTypes]);

    const filterTemplate = [1, 2, 6];

    return (
        <Container className={styles.container} loading={store.loading}>
            <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
                <Col span={7}>
                    <div style={{paddingBottom: "8px"}}>
                        <Form.Item noStyle name="noType">
                            <Radio.Group>
                                {optionsService.noTypes.map((opt) => {
                                    if (filterTemplate.includes(opt.value as number)) {
                                        return (
                                            <Radio key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </Radio>
                                        );
                                    }
                                })}
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
                    <Form.Item
                        label={t("入库时间")}
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
                            <Form.Item name="date" noStyle>
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
            <Container title={t("出库预报")} wrapperClassName={styles.wrapper} table>
                <Table
                    components={{body: {cell: EditableCell}}}
                    widthFit
                    bordered
                    loading={gridStore.loading}
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
                        pageSizeOptions: [50, 100, 200, 500],
                        defaultPageSize: 50,
                        size: "default",
                        onChange: gridStore.onTableChange.bind(gridStore),
                    }}
                    onChange={gridStore.onCommonTableChange.bind(gridStore)}
                />
            </Container>
            <OutboundEditModal
                store={store}
                refreshTable={gridStore.loadData.bind(gridStore)}
            />
        </Container>
    );
}

const Template = observer(OutboundComponent);

export default Template;
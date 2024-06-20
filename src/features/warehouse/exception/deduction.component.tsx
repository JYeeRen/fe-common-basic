import {observer} from "mobx-react-lite";
import {
    ClientGrid,
    Col, Container, EditableCell,
    FilterContainer,
    FilterTextArea,
    Form,
    Radio,
    SearchSelect, Table,
    textareaMaxLengthRule
} from "@components";
import * as DeductionConfig from "./deduction-config.tsx";
import {useStore} from "@hooks";
import {DeductionStore} from "@features/warehouse/exception/deduction.store.ts";
import {useCallback, useEffect, useMemo} from "react";
import {WarehouseDeductionFormValues} from "@features/warehouse/exception/type.ts";
import optionsService from "@services/options.service.ts";
import styles from "./deduction.module.less";
import {compact} from "lodash";

function DeductionComponent() {
    const gridStore = ClientGrid.useGridStore(DeductionConfig.getRows, {autoLoad: false});
    const {store, t} = useStore(DeductionStore, gridStore)(gridStore);

    useEffect(() => {
        store.gridStore.loadData();
    }, [store]);

    const handleFinish = useCallback((values: any = {}) => {
        const {noList, noType, receiptStatus, deductionStatus} = values;
        gridStore.setQueryParams({noList: compact(noList), noType, receiptStatus, deductionStatus});
    }, []);

    const handleRevert = () => {

    };

    const initialValues: WarehouseDeductionFormValues = useMemo(
        () => ({
            noList: [],
            noType: 0,
            receiptStatus: 0,
            deductionStatus: 0,
        }),
        []
    );

    const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

    const columns = useMemo(() => {
        const colDefs = DeductionConfig.getColumns({
            receiptStatusTypes: optionsService.receiptStatusTypes,
            deductionStatusTypes: optionsService.deductionStatusTypes,
            operation: {
                revert: handleRevert
            }
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
                    <Form.Item name="receiptStatus" label={t("货物状态")}>
                        <SearchSelect optionKey="receiptStatusTypes"/>
                    </Form.Item>
                    <Form.Item name="deductionStatus" label={t("扣货标记")}>
                        <SearchSelect optionKey="deductionStatusTypes"/>
                    </Form.Item>
                </Col>
            </FilterContainer>
            <Container title={t("扣货管理")} wrapperClassName={styles.wrapper} table>
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

const Template = observer(DeductionComponent);

export default Template;
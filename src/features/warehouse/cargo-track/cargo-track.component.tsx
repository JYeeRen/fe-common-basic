import {
    ClientGrid,
    Col,
    Container,
    EditableCell,
    FilterContainer,
    FilterTextArea,
    Form,
    Radio, SearchSelect,
    Table, textareaMaxLengthRule
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

function CargoTrackComponent() {
    const gridStore = ClientGrid.useGridStore(CargoTrackConfig.getRows, { autoLoad: false });
    const { store, t } = useStore(CargoTrackStore, gridStore)(gridStore);

    useEffect(() => {
        store.gridStore.loadData();
    }, [store]);

    const handleFinish = useCallback((values: any = {}) => {
        const { noList, noType, status} = values;
        gridStore.setQueryParams({ noList: compact(noList), noType, status });
    }, []);

    const initialValues: WarehouseCargoTrackFormValues = useMemo(
        () => ({
            noList: [],
            noType: 0,
            status: 0,
        }),
        []
    );

    const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

    const columns = useMemo(() => {
        const colDefs = CargoTrackConfig.getColumns({
            receiptStatusTypes: optionsService.receiptStatusTypes,
        });
        return colDefs;
    }, [optionsService.receiptStatusTypes]);

    return (
        <Container className={styles.container} loading={store.loading}>
            <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
                <Col span={7}>
                    <div style={{ paddingBottom: "8px" }}>
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
                    <Form.Item name="noList" wrapperCol={{ span: 22 }} rules={numberRules}>
                        <FilterTextArea
                            style={{ width: "100%", height: 75, resize: "none" }}
                            placeholder={t("最多可查询50条，以逗号，空格或回车隔开")}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="status" label={t("货物状态")}>
                        <SearchSelect optionKey="receiptStatusTypes" />
                    </Form.Item>
                </Col>
            </FilterContainer>
            <Container title={t("货物查询")} wrapperClassName={styles.wrapper} table>
                <Table
                    components={{ body: { cell: EditableCell } }}
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
                        showTotal: (total) => t("共{{total}}条", { total }),
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
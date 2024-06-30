import {DeductionStore} from "@features/warehouse/exception/deduction.store.ts";
import {observer} from "mobx-react-lite";
import {useTranslation} from "@locale";
import {
    ClientGrid,
    EditableCell,
    FilterContainer,
    FilterTextArea,
    Radio,
    Table,
    textareaMaxLengthRule, Button, Col, Form, Modal, Row
} from "@components";
import * as DeductionModalConfig from "@features/warehouse/exception/deduction-modal-config.tsx";
import {useStore} from "@hooks";
import {DeductionModalStore} from "@features/warehouse/exception/deduction-modal.store.ts";
import {useCallback, useEffect, useMemo} from "react";
import {compact} from "lodash";
import {WarehouseDeductionFormValues} from "@features/warehouse/exception/type.ts";
import optionsService from "@services/options.service.ts";

interface IDeductionModal {
    mainStore: DeductionStore,
    refreshTable: () => void;
}

export const DeductionModal = observer((props: IDeductionModal) => {
    const {mainStore, refreshTable} = props;
    const [t] = useTranslation();
    const gridStore = ClientGrid.useGridStore(DeductionModalConfig.getRows, {autoLoad: false});
    const {store} = useStore(DeductionModalStore, gridStore)(gridStore);

    useEffect(() => {
        store.gridStore.loadData();
    }, [store]);

    const handleFinish = useCallback((values: any = {}) => {
        const {noList, noType} = values;
        gridStore.setQueryParams({noList: compact(noList), noType});
    }, []);

    const initialValues: WarehouseDeductionFormValues = useMemo(
        () => ({
            noList: [],
            noType: 0,
        }),
        []
    );

    const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

    const columns = useMemo(() => {
        const colDefs = DeductionModalConfig.getColumns({
            receiptStatusTypes: optionsService.receiptStatusTypes,
        });
        return colDefs;
    }, [optionsService.receiptStatusTypes]);

    const onOk = async () => {
        Modal.confirm({
            title: t("操作确认"),
            content: t(
                "是否确认发起对选中货物的扣货指令？"
            ),
            okText: t("确认"),
            cancelText: t("取消"),
            onOk: () => {
                store.initiateDeduction({
                    ids: store.selectedRowKeys
                }).then(() => {
                    mainStore.hideInitiateModal();
                    refreshTable();
                });
            },
        });
    };

    const onCancel = () => {
        mainStore.hideInitiateModal();
    };

    const filterTemplate = [1, 2];

    return (
        <Modal
            open={mainStore.initiateModalVisible}
            title={t("新增托盘")}
            width={'50%'}
            destroyOnClose
            onCancel={onCancel}
            maskClosable={false}
            footer={null}
            afterOpenChange={handleFinish}
            afterClose={store.clearSelectedRows.bind(store)}
        >
            <FilterContainer onFinish={handleFinish} initialValues={initialValues}>
                <Col span={12}>
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
            </FilterContainer>
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
            <Row justify="end" className="my-4">
                <Button className="mr-4" onClick={onCancel}>
                    {t("取消")}
                </Button>
                <Button onClick={onOk} loading={store.loading} type="primary">
                    {t("发起扣货")}
                </Button>
            </Row>
        </Modal>
    );
});
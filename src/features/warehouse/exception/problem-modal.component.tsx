import {ProblemStore} from "@features/warehouse/exception/problem.store.ts";
import {observer} from "mobx-react-lite";
import {useTranslation} from "@locale";
import {
    ClientGrid,
    textareaMaxLengthRule,
    Modal,
    Col,
    Form,
    Radio,
    FilterTextArea,
    FilterContainer,
    EditableCell,
    Table,
    Button,
} from "@components";
import * as ProblemModalConfig from "@features/warehouse/exception/problem-modal-config.tsx";
import {useStore} from "@hooks";
import {ProblemModalStore} from "@features/warehouse/exception/problem-modal.store.ts";
import {useCallback, useEffect, useMemo} from "react";
import {compact} from "lodash";
import optionsService from "@services/options.service.ts";
import {ReceiptIssueLink, WarehouseProblemFormValues} from "@features/warehouse/exception/type.ts";
import {ProblemCreateModalComponent} from "@features/warehouse/exception/problem-create-modal.component.tsx";

interface IProblemModal {
    mainStore: ProblemStore,
    refreshTable: () => void;
}

export const ProblemModalComponent = observer((props: IProblemModal) => {
    const {mainStore, refreshTable} = props;
    const [t] = useTranslation();
    const gridStore = ClientGrid.useGridStore(ProblemModalConfig.getRows, {autoLoad: false});
    const {store} = useStore(ProblemModalStore, gridStore)(gridStore);

    useEffect(() => {
        store.gridStore.loadData();
    }, [store]);

    const handleFinish = useCallback((values: any = {}) => {
        const {noList, noType} = values;
        gridStore.setQueryParams({noList: compact(noList), noType});
    }, []);

    const handleLink = async (value: ReceiptIssueLink) => {
        await store.doLink({
            receiptId: value.id,
            issueId: mainStore.problemLinkSelected!.id,
        })
        mainStore.hideProblemLinkModal();
        refreshTable();
    };

    const handleAdd = () => {
        store.showCreateModal(mainStore.problemLinkSelected!);
    };

    const handleCancel = () => {
        mainStore.hideProblemLinkModal();
        refreshTable();
    };

    const initialValues: WarehouseProblemFormValues = useMemo(
        () => ({
            noList: [],
            noType: 0,
        }),
        []
    );

    const numberRules = useMemo(() => [textareaMaxLengthRule()], []);

    const columns = useMemo(() => {
        const colDefs = ProblemModalConfig.getColumns({
            receiptStatusTypes: optionsService.receiptStatusTypes,
            operation: {
                link: handleLink,
            }
        });
        return colDefs;
    }, [optionsService.receiptStatusTypes]);

    const filterTemplate = [1, 2];

    return (
        <Modal
            open={mainStore.problemLinkModalVisible}
            title={t("关联包裹")}
            width={'75%'}
            destroyOnClose
            onCancel={handleCancel}
            maskClosable={false}
            footer={null}
            afterOpenChange={handleFinish}>
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
            <Button onClick={handleAdd}>
                {t("未找到包裹？新增一条入库预报>>")}
            </Button>
            <ProblemCreateModalComponent
                store={store}
                handleConfirm={handleCancel}
            />
        </Modal>
    );
});
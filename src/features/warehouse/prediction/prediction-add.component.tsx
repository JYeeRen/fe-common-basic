import { observer } from "mobx-react-lite";
import {
  ClientGrid,
  Container,
  Row,
  Col, EditableCell, Table, Button, Form, Space, SearchSelect, DatePicker, Input, SubmitButton, Modal
} from "@components";
import styles from "@features/warehouse/prediction/prediction-operation.module.less";
import * as PredictionAddConfig from "@features/warehouse/prediction/prediction-add-config.tsx";
import { useStore } from "@hooks";
import { PredictionAddStore } from "@features/warehouse/prediction/prediction-add.store.ts";
import { useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import { InBoundRes } from "@features/warehouse/prediction/type.ts";
import { convertDate } from "@infra";
import { useLocation } from "react-router-dom";

const PredictionAddComponent = observer(() => {
  const gridStore = ClientGrid.useGridStore(PredictionAddConfig.getRows, { autoLoad: false });
  const { store, t, navigate } = useStore(PredictionAddStore, gridStore)(gridStore);
  const [form] = Form.useForm();
  const location = useLocation();

  useEffect(() => {
    const bigBagNoArray = location.state?.bigBagNoArray;
    gridStore.setQueryParams({ noList: bigBagNoArray, noType: 1 });
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

    if (isFieldChanged({ receiptTimeZone, receiptTimeData, palletCode })) {
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

  const operationConfirm = useCallback((res: InBoundRes) => {
    const { failed, total, success } = res;
    const modal = Modal.confirm({
      title: t("操作确认"),
      footer: (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              modal.destroy();
              navigate(-1);
            }}
          >
            {t('确认')}
          </Button>
        </div>
      ),
      content: (
        <>
          <p style={{ color: "#c7c7c7" }}>
            {t("全部提交数据：{{n}}条。", { n: total })}
          </p>
          <p style={{ color: "#c7c7c7" }}>
            {t("完成提交数据：{{n1}}条。未提交数据：{{n2}}条。", {
              n1: success,
              n2: total - success,
            })}
          </p>
          <p style={{ color: "#c7c7c7" }}>{t("未完成数据提单号如下：")}</p>
          {failed.map((item, index) => (
            <p key={`${index}_${item.number}`} style={{ color: "#c7c7c7" }}>
              {`${item.number} ${t("原因")}: ${item.reason}`}
            </p>
          ))}
        </>
      ),
    });
  }, []);

  const onConfirm = async () => {
    const {
      receiptTimeZone,
      receiptTimeData,
      palletCode,
      tailProviderId,
    } = form.getFieldsValue();

    const bigBagIds = gridStore.rowData.map(row => row.id);

    const formData = {
      bigBagIds,
      receiptTime: receiptTimeData ? convertDate(receiptTimeData, receiptTimeZone).format(
        "YYYY-MM-DDTHH:mm:ssZ"
      ) : "",
      palletCode,
      tailProviderId,
    }

    const res = await store.doInBound(formData);

    operationConfirm(res);
  };

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
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
                components={{ body: { cell: EditableCell } }}
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
                  showTotal: (total) => t("共{{total}}条", { total }),
                  showQuickJumper: true,
                  showSizeChanger: true,
                  pageSizeOptions: [50, 100, 200, 500],
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
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                className={styles.form}
                onFinish={onConfirm}>
                <Form.Item
                  label={t("入库时间")}
                  name="receiptTimeData"
                  rules={[{ required: true }]}
                >
                  <Space.Compact>
                    <Form.Item name="receiptTimeZone" noStyle>
                      <SearchSelect
                        optionKey="timeZones"
                        placeholder={t("选择时区")}
                        style={{ width: "200px" }}
                      />
                    </Form.Item>
                    <Form.Item name="receiptTimeData" noStyle>
                      <DatePicker
                        showTime
                        style={{ width: "300px" }}
                        placeholder={t("请选择时间")}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
                <Form.Item
                  label={t("托盘码")}
                  name="palletCode"
                  rules={[{ required: true }]}
                >
                  <Input placeholder={t("托盘码")} />
                </Form.Item>
                <Form.Item
                  name="tailProviderId"
                  label={t("尾程服务商")}
                  rules={[{ required: true }]}
                >
                  <SearchSelect
                    optionKey="trailProviders"
                  />
                </Form.Item>
              </Form>
              <span style={{ color: "red" }}>
                {t("注意：单次手动入库只支持同一尾程服务商的货物进入同一托盘，如需为不同尾程服务商货物入库，请分开多次操作")}
              </span>
            </Container>
          </Col>
        </Row>
        <Row justify="end" className="my-4">
          <SubmitButton form={form} onClick={onConfirm} style={{ marginRight: "8px" }}>
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
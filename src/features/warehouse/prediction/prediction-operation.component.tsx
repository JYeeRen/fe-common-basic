import {
  Block,
  Button,
  Container,
  Form,
  Input,
  Modal,
  Space,
  SubmitButton,
  DatePicker, SearchSelect,
} from "@components";
import { useTranslation } from "@locale";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PredictionOperationStore } from "@features/warehouse/prediction/prediction-operation.store.ts";
import styles from "./prediction-operation.module.less";
import { observer } from "mobx-react-lite";
import { dayjs } from "@infra";
import optionsService from "@services/options.service.ts";

interface IPredictionOperation {
  title: string;
  store: PredictionOperationStore;
}

function PredictionOperationComponent(props: IPredictionOperation) {
  const { title, store } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const values = JSON.parse(JSON.stringify(store.initialValues));
    if (values.ata) {
      values.ata = dayjs(values.ata);
    }
    form.setFieldsValue(values);
  }, [form, store.initialValues]);

  const onReset = () => {
    form.resetFields();
    const values = JSON.parse(JSON.stringify(store.initialValues));
    values.ata = dayjs(values.ata);
    form.setFieldsValue(values);
  };

  const handleFinish = async (values: any) => {
    values.ata = dayjs(values.ata).format();
    await store.handleSubmit(values);
    navigate(-1);
  };

  const handleBack = () => {
    const {
      masterWaybillNo,
      bigBagNo,
      tailProviderName,
    } = form.getFieldsValue();
    if (store.isFieldChanged({
      masterWaybillNo,
      bigBagNo,
      tailProviderName,
    })) {
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

  const handleTailChange = (value: any) => {
    if (!value) {
      form.setFieldValue('arrivePort', '');
      return;
    }
    const obj = optionsService.portNameByTail.find((item: any) => item.value === value);
    form.setFieldValue('arrivePort', obj?.label);
  };

  return (
    <Container
      className={styles.container}
      title={title}
      loading={store.loading}
      backable
      onBack={handleBack}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        form={form}
        className={styles.form}
        onFinish={handleFinish}
        onReset={onReset}
      >
        <Form.Item
          label={t("提单号")}
          name="masterWaybillNo"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("请填写提单号")} disabled={!!store.id}/>
        </Form.Item>
        <Form.Item
          label={t("袋号")}
          name="bigBagNo"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("请填写袋号")} disabled={!!store.id}/>
        </Form.Item>
        <Form.Item
          label={t("尾程服务商名称")}
          name="tailProviderId"
          rules={[{ required: true }]}
        >
          <SearchSelect
            optionKey="trailProviders"
            onChange={handleTailChange}
          />
        </Form.Item>
        <Form.Item
          label={t("客户名称")}
          name="customerName"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("请填写") + t("客户名称")}/>
        </Form.Item>
        <Form.Item
          label={t("到港时间")}
          name="ata"
        >
          <DatePicker
            showTime
            style={{ marginLeft: "10px" }}
          />
        </Form.Item>
        <Form.Item
          label={t("入库口岸")}
          name="arrivePort"
          rules={[{ required: true }]}
        >
          <Input disabled/>
        </Form.Item>
        <Block if={!!store.id}>
          <Form.Item>
            <span className={styles.tips}>
              {t("注：提单号和袋号不可修改，若数据错误，请删除后重新录入。")}
            </span>
          </Form.Item>
        </Block>
        <Form.Item>
          <div className="flex items-center justify-center">
            <Space size={60}>
              <SubmitButton form={form}>{t("提交")}</SubmitButton>
              <Button htmlType="reset" className="operation-btn">
                {t("重置")}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Container>
  );
}

const PredictionOperation = observer(PredictionOperationComponent);

export default PredictionOperation;
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  SearchSelect,
  SubmitButton,
  Typography,
} from "@components";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@locale";
import { v4 as uuid } from "uuid";
import { R } from "./waybill-statistics.types";

interface Props {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (values: any) => void;
  rows: R[];
}

function WaybillStatisticsBOLModalImpl(props: Props) {
  const { loading, open, onCancel, onConfirm, rows } = props;
  const [form] = Form.useForm();
  const [t] = useTranslation();

  const handleFinish = async () => {
    const {
      date,
      shipFromName,
      address,
      cityState,
      zip,
      shipToVendorId,
      carrierVendorId,
    } = await form.getFieldsValue();
    await onConfirm({
      ids: rows.map(r => r.id),
      date: date.format('YYYY-MM-DD'),
      shipFromName,
      shipFromAddress: [address, cityState, zip].join(", "),
      shipToVendorId,
      carrierVendorId,
    });
  };

  const initialValues = {
    shipFromName: "R&T Logistics Inc",
    address: "4882 West 145th Street",
    cityState: "Hawthorne, CA",
    zip: "90250",
    shipToVendorId: "",
    carrierVendorId: "",
  };

  return (
    <Modal
      okText={t("确认")}
      cancelText={t("取消")}
      title={t("生成BOL")}
      footer={null}
      open={open}
      onCancel={onCancel}
      maskClosable={false}
      width={700}
      destroyOnClose
      afterClose={form.resetFields}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ width: "100%", margin: "0 auto" }}
        initialValues={initialValues}
      >
        <Row>
          <Col span={7}>
            <Typography.Title level={5}>AWB List</Typography.Title>
            {rows.map((row) => (
              <Typography.Paragraph key={uuid()}>{row.masterWaybillNo}</Typography.Paragraph>
            ))}
          </Col>
          <Col span={17}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={<Typography.Title level={5}>Ship From</Typography.Title>}
                >
                  <Row>
                    <Col span={24}>
                      <Form.Item name="shipFromName" label="Name">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="address" label="Address">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="cityState" label="City/State">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="zip" label="Zipcode">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col offset={1} span={11}>
                <Form.Item
                  label={<Typography.Title level={5}>Ship To</Typography.Title>}
                  name="shipToVendorId"
                  rules={[{ required: true }]}
                >
                  <SearchSelect optionKey="vendorTailProviders" />
                </Form.Item>
                <Form.Item
                  label={<Typography.Title level={5}>Carrier Name</Typography.Title>}
                  name="carrierVendorId"
                  rules={[{ required: true }]}
                >
                  <SearchSelect optionKey="vendorCarriers" />
                </Form.Item>
                <Form.Item
                  label={<Typography.Title level={5}>Date</Typography.Title>}
                  name="date"
                  rules={[{ required: true }]}
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row justify="end" className="my-4">
          <Button className="mr-4" onClick={onCancel}>
            {t("取消")}
          </Button>
          <SubmitButton loading={loading} form={form} onClick={handleFinish}>
            {t("确定")}
          </SubmitButton>
        </Row>
      </Form>
    </Modal>
  );
}

export const WaybillStatisticsBOLModal = observer(WaybillStatisticsBOLModalImpl);

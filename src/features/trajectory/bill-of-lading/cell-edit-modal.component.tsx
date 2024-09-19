import {
  Button,
  DatePicker,
  Form,
  Modal,
  Row,
  SearchSelect,
  Space,
  SubmitButton,
} from "@components";
import { useTranslation } from "@locale";
import { observer } from "mobx-react-lite";
import { BillOfLadingStore } from "./bill-of-lading.store";
import { convertDate, dayjs } from "@infra";
import optionsService from "@services/options.service";
import { find } from "lodash";
import { CustomsTrack } from "./type";

const keymap = {
  etd: 'etd',
  eta: 'eta',
  ata: "ata",
  atd: "atd",
  customs_submitted: "customsSubmittedTime",
  customs_accepted: "customsAcceptedTime",
  customs_release: "customsReleaseTime",
  picked_up: "pickedUpTime",
  handed_over: "handedOverTime",
  customs_inspection: "customsInspection",
} as const;

interface UploadModalProps {
  store: BillOfLadingStore;
  open: boolean;
  record?: CustomsTrack;
  handleSave: (date: string, tz: string) => Promise<boolean>;
}

function CellEditModalComponent(props: UploadModalProps) {
  const { store, open, handleSave, record } = props;

  const [t] = useTranslation();
  const [form] = Form.useForm();

  const getInitialValue = () => {
    const { key } = store.editingCell || {};
    let value = undefined;
    let tz = undefined;
    const convertKey = key && keymap[key as keyof typeof keymap];

    if (record && convertKey) {
      value = record[convertKey] ?? "";
      const offsetMMHH = value.replace(/.*\((UTC[+-]\d+)\).*/, "$1");
      value = value.replace(/(.*)( \(UTC[+-]\d+\))$/, "$1");
      if (offsetMMHH) {
        tz =
          find(optionsService.timeZones, (tz) => tz.label.includes(offsetMMHH))
            ?.value ?? "";
      }
    }
    return { tz, datetime: value && dayjs(value) };
  };

  const initialValues = getInitialValue();

  const handleFinish = async () => {
    const { tz, datetime } = form.getFieldsValue();
    const res = convertDate(datetime, tz).format("YYYY-MM-DDTHH:mm:ssZ");

    const origin =
      initialValues.datetime &&
      initialValues.tz &&
      convertDate(initialValues.datetime, initialValues.tz).format(
        "YYYY-MM-DDTHH:mm:ssZ"
      );
    if (res === origin) {
      store.setEditingCell(undefined);
      return;
    }

    if (store.editingCell?.record && store.editingCell.key) {
      if (await handleSave(res, tz)) {
        store.setEditingCell(undefined);
      }
    }
  };

  return (
    <Modal
      okText={t("确认")}
      cancelText={t("取消")}
      title={t("时间录入")}
      footer={null}
      open={open}
      onCancel={store.setEditingCell.bind(store, undefined)}
      maskClosable={false}
      closable={false}
      width={600}
      destroyOnClose
      afterClose={form.resetFields}
    >
      <>
        <div className="mt-10">
          <Form
            form={form}
            layout="vertical"
            style={{ width: "100%", margin: "0 auto" }}
            initialValues={initialValues}
          >
            <Form.Item label={store.editingCell?.title}>
              <Space.Compact>
                <Form.Item name="tz" noStyle rules={[{ required: true }]}>
                  <SearchSelect
                    optionKey="timeZones"
                    placeholder={t("选择时区")}
                    style={{ minWidth: "200px" }}
                  />
                </Form.Item>
                <Form.Item name="datetime" noStyle rules={[{ required: true }]}>
                  <DatePicker
                    style={{ minWidth: "200px" }}
                    showTime
                    placeholder={t("请选择时间")}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Form>
        </div>
        <Row justify="end" className="my-4">
          <Button
            className="mr-4"
            onClick={store.setEditingCell.bind(store, undefined)}
          >
            {t("取消")}
          </Button>
          <SubmitButton form={form} onClick={handleFinish}>
            {t("确定")}
          </SubmitButton>
        </Row>
      </>
    </Modal>
  );
}

export const CellEditModal = observer(CellEditModalComponent);

import {
  Block,
  Button,
  Col,
  Form,
  Modal,
  Row,
  SearchSelect,
  SubmitButton,
  Upload,
} from "@components";
import { useTranslation } from "@locale";
import { observer } from "mobx-react-lite";
import type { DeclrationStore } from "../declaration.store";
import optionsService from "@services/options.service";
import styles from "./createDocumentModal.module.less";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

interface CreateDocumentModalProps {
  store: DeclrationStore;
  onCancel?: () => void;
  onOk?: () => void;
}

interface SelectTemplateProps {
  store: DeclrationStore;
  onCancel: () => void;
  onOk: (templateId: number) => Promise<void>;
}

const SelectTemplate = observer((props: SelectTemplateProps) => {
  const { onCancel, onOk, store } = props;

  const [t] = useTranslation();
  const [form] = Form.useForm();

  return (
    <>
      <div className="mt-10">
        <Form form={form}>
          <Form.Item
            name="customTemplateId"
            label={t("选择模板")}
            rules={[{ required: true }]}
          >
            <SearchSelect
              options={optionsService.format(optionsService.customsTemplates)}
              placeholder={t("请选择模板")}
            />
          </Form.Item>
        </Form>
      </div>
      <Row justify="end" className="my-4">
        <Button className="mr-4" onClick={onCancel}>
          {t("取消")}
        </Button>
        <SubmitButton
          form={form}
          onClick={() => onOk(form.getFieldValue("customTemplateId"))}
          loading={store.loading}
        >
          {t("确定")}
        </SubmitButton>
      </Row>
    </>
  );
});

const CheckDocument = observer((props: CreateDocumentModalProps) => {
  const { onCancel, onOk, store } = props;

  const [t] = useTranslation();

  return (
    <>
      <div className="mt-10">
        <Row justify="center" className="my-5">
          {t(
            "清关资料已生成，请下载检查，若资料有误，请修改后在下方附件处上传。"
          )}
        </Row>
        <Row justify="center" className="my-5">
          <div style={{ display: "inline-block", color: "orange" }}>
            {t("注意：")}
          </div>
          <div style={{ display: "inline-block" }}>
            <p>{t("修改文件时，请不要增删文件的行列数，不要修改字段名称。")}</p>
            <p>{t("上传新文件后，将覆盖之前的文件，请谨慎操作！")}</p>
          </div>
        </Row>
        <Row className="my-5 mb-10" align="middle">
          <Col span={12}>
            <Button
              type="primary"
              onClick={store.downloadSelectedCustomsFile.bind(store)}
              loading={store.loading}
            >
              {t("下载清关文件")}
            </Button>
          </Col>
          <Col span={12} className="justify-center">
            <Block if={!store.hasTakeOf}>
            <span>{t("修改清关文件：")}</span>
            <Upload name="file" action="" accept=".xlsx,.xls,.rar,.zip">
              <Button icon={<UploadOutlined />} loading={store.loading}>
                {t("上传附件")}
              </Button>
            </Upload>
            <span className={styles.tip}>
              {t("附件支持的格式：'xlsx'，'xls'，'zip'，'rar'")}
            </span>
            </Block>
          </Col>
        </Row>
      </div>
      <Row justify="end" className="my-4">
        <Button className="mr-4" onClick={onCancel}>
          {t("取消")}
        </Button>
        <Button type="primary" onClick={onOk} loading={store.loading}>
          {t("确认无误，提交文件")}
        </Button>
      </Row>
    </>
  );
});

export const CreateDocumentModal = observer(
  ({ store }: CreateDocumentModalProps) => {
    const [t] = useTranslation();

    const [step, setSetp] = useState(1);

    const createCustomFile = async (templateId: number) => {
      await store.createCustomFile(templateId);
      setSetp(2);
    };

    const onCancel = () => {
      store.setCreatingCustomDocs(false);
      setSetp(1);
    };

    return (
      <Modal
        open={store.creatingCustomDocs}
        title={t("清关单证制作")}
        footer={null}
        maskClosable={false}
        width={600}
        destroyOnClose
      >
        <Block if={step === 1}>
          <SelectTemplate
            store={store}
            onCancel={onCancel}
            onOk={createCustomFile}
          />
        </Block>
        <Block if={step === 2}>
          <CheckDocument
            store={store}
            onCancel={onCancel}
            onOk={() => console.log("!!!!CheckDocument")}
          />
        </Block>
      </Modal>
    );
  }
);

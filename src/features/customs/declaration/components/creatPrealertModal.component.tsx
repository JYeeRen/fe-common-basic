import {
  Block,
  Button,
  Col,
  FileUpload,
  Form,
  Modal,
  Row,
  SearchSelect,
  SubmitButton,
} from "@components";
import { useTranslation } from "@locale";
import { observer } from "mobx-react-lite";
import type { DeclrationStore } from "../declaration.store";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface CreatePrealertModalProps {
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
            name="templateId"
            label={t("选择模板")}
            rules={[{ required: true }]}
          >
            <SearchSelect
              optionKey="prealertTemplates"
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
          onClick={() => onOk(form.getFieldValue("templateId"))}
          loading={store.loading}
        >
          {t("确定")}
        </SubmitButton>
      </Row>
    </>
  );
});

interface CheckDocumentProps {
  store: DeclrationStore;
  onCancel?: () => void;
}

const CheckDocument = observer((props: CheckDocumentProps) => {
  const { onCancel, store } = props;

  const [t] = useTranslation();
  const [form] = Form.useForm();

  const handleOk = async () => {
    const { prealertFiles = [] } = form.getFieldsValue();
    const formData = new FormData();
    formData.append("ids", JSON.stringify(store.selectedRowKeys));

    const masterWaybillNos = store.selectedRows.map(
      (row) => row.masterWaybillNo
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prealertFiles as any[]).forEach((file) => {
      const matchName = masterWaybillNos.some(
        (no) => file.name === `${no}_prealert.xlsx`
      );
      if (matchName) {
        formData.append("files", file.originFileObj);
      }
    });

    const { failed, total, success } = await store.uploadPrealerts(
      formData,
      prealertFiles.length === 0
    );

    store.setCreatingPrealertDocs(false);

    if (prealertFiles.length === 0 && failed.length === 0) {
      return store.gridStore.loadData();
    }

    const modal = Modal.confirm({
      title: t("操作确认"),
      width: 500,
      content: (
        <div>
          <p style={{ marginBottom: "5px" }}>
            {t("选择提单个数：{{no}}个", { no: total })}
          </p>
          <p style={{ marginBottom: "5px" }}>
            {t("完成上传提单个数：{{no}}个", { no: success })}
          </p>
          <Block if={failed.length > 0}>
            <p style={{ marginBottom: "5px" }}>{t("未完成数据提单号如下：")}</p>
            {failed.map(({ number }, index) => (
              <p key={`${number}-${index}`}>{number}</p>
            ))}
            <p
              style={{
                marginTop: "20px",
                marginBottom: "5px",
                fontSize: "13px",
                color: "#787878",
              }}
            >
              {t("备注")}
              {": "}
              {t("未找到对应提单号文件，不予上传。")}
              {t("文件命名规则： 提单号_prealert.xlsx")}
            </p>
          </Block>
        </div>
      ),
      footer: (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            <CopyToClipboard
              text={failed.map((i) => `${i.number} ${i.reason}`).join("\n")}
            >
              <span style={{ color: "#fff", cursor: "pointer" }}>
                {"复制原因"}
              </span>
            </CopyToClipboard>
          </span>
          <span>
            <CopyToClipboard text={failed.map((i) => i.number).join("\n")}>
              <Button
                key="back"
                onClick={() => {
                  store.gridStore.loadData();
                  modal.destroy();
                }}
                style={{ marginRight: "10px" }} // 添加右边距
              >
                {t("复制未完成单号")}
              </Button>
            </CopyToClipboard>
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                store.gridStore.loadData();
                modal.destroy();
              }}
            >
              {t("确认")}
            </Button>
          </span>
        </div>
      ),
    });
  };

  return (
    <>
      <Form form={form}>
        <div className="mt-10">
          <Block if={store.hasTakeOf}>
              <Row justify="center" className="my-5">
                {t(
                  "预报文件已生成，可下载查看。（提单已起飞，无法人工上传修改。）"
                )}
              </Row>
              <Row justify="center" className="my-5">
                {t("已起飞的提单确认提交后无法修改。")}
              </Row>
          </Block>
          <Block if={!store.hasTakeOf}>
            <Row justify="center" className="my-5">
              {t(
                "预报文件已生成，请下载检查，若资料有误，请修改后在下方附件处上传。"
              )}
            </Row>
            <Row justify="center" className="my-5">
              <div style={{ display: "inline-block", color: "orange" }}>
                {t("注意：")}
              </div>
              <div style={{ display: "inline-block" }}>
                <p>
                  {t("修改文件时，请不要增删文件的行列数，不要修改字段名称。")}
                </p>
                <p>{t("上传新文件后，将覆盖之前的文件，请谨慎操作！")}</p>
              </div>
            </Row>
          </Block>
          <Row className="my-5 mb-10" align="middle">
            <Col span={12} className="flex justify-center">
              <Button
                type="primary"
                onClick={store.downloadTempPrealert.bind(store)}
                loading={store.loading}
              >
                {t("下载预报文件")}
              </Button>
            </Col>
            <Col span={12} className="justify-center">
              <Block if={!store.hasTakeOf}>
                <Form.Item noStyle name="prealertFiles">
                  <FileUpload
                    title={t("修改清关文件：")}
                    loading={store.loading}
                    multiple
                  />
                </Form.Item>
              </Block>
            </Col>
          </Row>
        </div>
        <Row justify="end" className="my-4">
          {/* <Block if={store.hasTakeOf}>
            <Button
              className="mr-4"
              onClick={() => {
                onCancel?.();
                store.gridStore.loadData();
              }}
            >
              {t("确定")}
            </Button>
          </Block> */}
          {/* <Block if={!store.hasTakeOf}> */}
          <>
            <Button className="mr-4" onClick={onCancel}>
              {t("取消")}
            </Button>
            <Button type="primary" onClick={handleOk} loading={store.loading}>
              {t("确认无误，提交文件")}
            </Button>
          </>
          {/* </Block> */}
        </Row>
      </Form>
    </>
  );
});

export const CreatePrealerttModal = observer(
  ({ store }: CreatePrealertModalProps) => {
    const [t] = useTranslation();

    const [step, setSetp] = useState(1);

    const createPrealert = async (templateId: number) => {
      await store.createPrealert(templateId);
      setSetp(2);
    };

    const onCancel = () => {
      store.setCreatingPrealertDocs(false);
      setSetp(1);
    };

    return (
      <Modal
        open={store.creatingPrealertDocs}
        title={t("预报文件制作")}
        footer={null}
        maskClosable={false}
        width={600}
        destroyOnClose
        afterClose={() => setSetp(1)}
        onCancel={onCancel}
      >
        <Block if={step === 1}>
          <SelectTemplate
            store={store}
            onCancel={onCancel}
            onOk={createPrealert}
          />
        </Block>
        <Block if={step === 2}>
          <CheckDocument store={store} onCancel={onCancel} />
        </Block>
      </Modal>
    );
  }
);

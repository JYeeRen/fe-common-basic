import { Block, Button, Col, FileUpload, Form, Modal, Row } from "@components";
import { useTranslation } from "@locale";
import { DeclrationStore } from "../declaration.store";
import { observer } from "mobx-react-lite";

interface EditDocumentModalProps {
  store: DeclrationStore;
}

export const EditDocumentModal = observer((props: EditDocumentModalProps) => {
  const { store } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const onCancel = () => {
    store.setEditing(null);
  };
  const onOk = async () => {
    const { customsFiles = [], prealertFiles = [] } = form.getFieldsValue();
    if ([...customsFiles, ...prealertFiles].length === 0) {
      onCancel();
      return;
    }

    const failds = [];

    if (customsFiles && customsFiles.length > 0) {
      const customsFilesData = new FormData();
      customsFilesData.append("file", customsFiles[0].originFileObj);
      customsFilesData.append("id", `${store.editing?.id || 0}`);
      const customsFailed = await store.uploadCustomsFile(customsFilesData);
      customsFailed?.length && failds.push(...customsFailed);
    }

    if (prealertFiles && prealertFiles.length > 0) {
      const prealertFilesData = new FormData();
      prealertFilesData.append("file", prealertFiles[0].originFileObj);
      prealertFilesData.append("id", `${store.editing?.id || 0}`);
      const prealertField = await store.uploadPrealert(prealertFilesData);
      prealertField?.length && failds.push(...prealertField);
    }

    store.setEditing(null);
    store.gridStore.loadData();
  };

  return (
    <Modal
      open={Boolean(store.editing)}
      footer={null}
      title={t("编辑相关文件")}
      onCancel={onCancel}
      width={700}
      destroyOnClose
      maskClosable={false}
      afterClose={() => form.resetFields()}
    >
      <Form form={form}>
        <Row className="my-8">
          <p>
            {t(
              "当前订单 “订单号{{no}}”，已制作文件如下，请下载检查，若资料有误，请修改后在下方附件处上传。",
              {
                no: store.editing?.masterWaybillNo,
              }
            )}
          </p>
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
        <Row className="my-5 mb-10" align="top">
          <Block if={store.editing?.customsFile}>
            <Col span={12}>
              <Row justify="center" className="mb-4">
                <Button
                  type="primary"
                  onClick={store.downloadCustomsFile.bind(
                    store,
                    store.editing?.id
                  )}
                  loading={store.loading}
                  disabled={!store.editing?.customsFile}
                >
                  {t("下载清关文件")}
                </Button>
              </Row>
              <Row justify="start">
                <Block if={!store.hasTakeOf}>
                  <Form.Item noStyle name="customsFiles">
                    <FileUpload
                      maxCount={1}
                      loading={store.loading}
                      title={t("修改清关文件：")}
                    />
                  </Form.Item>
                </Block>
              </Row>
            </Col>
          </Block>
          <Block if={store.editing?.prealertFile}>
            <Col span={12} className="justify-center">
              <Row justify="center" className="mb-4">
                <Button
                  type="primary"
                  onClick={store.downloadPrealert.bind(
                    store,
                    store.editing?.id
                  )}
                  loading={store.loading}
                  disabled={!store.editing?.prealertFile}
                >
                  {t("下载预报文件")}
                </Button>
              </Row>
              <Row justify="start">
                <Block if={!store.hasTakeOf}>
                  <Form.Item noStyle name="prealertFiles">
                    <FileUpload
                      maxCount={1}
                      loading={store.loading}
                      title={t("修改预报文件：")}
                    />
                  </Form.Item>
                </Block>
              </Row>
            </Col>
          </Block>
        </Row>
        <Row justify="end" className="my-4">
          <Button className="mr-4" onClick={onCancel}>
            {t("取消")}
          </Button>
          <Button type="primary" onClick={onOk} loading={store.loading}>
            {t("确认无误，提交文件")}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
});

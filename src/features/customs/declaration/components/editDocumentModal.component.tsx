import { Block, Button, Col, Modal, Row, Upload } from "@components";
import { useTranslation } from "@locale";
import { DeclrationStore } from "../declaration.store";
import { observer } from "mobx-react-lite";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./createDocumentModal.module.less";

export const EditDocumentModal = observer(
  (props: { store: DeclrationStore }) => {
    const { store } = props;
    const [t] = useTranslation();

    return (
      <Modal
        open={Boolean(store.editing)}
        footer={null}
        title={t("编辑相关文件")}
        onCancel={store.setViewing.bind(store, null)}
        width={600}
        destroyOnClose
      >
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
        <Row className="my-5 mb-10" align="middle">
          <Col span={12}>
            <Row justify="center" className="mb-4">
              <Button
                type="primary"
                onClick={store.downloadCustomsFile.bind(
                  store,
                  store.editing?.id
                )}
                loading={store.loading}
              >
                {t("下载清关文件")}
              </Button>
            </Row>
            <Row justify="center">
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
            </Row>
          </Col>
          <Col span={12} className="justify-center">
            <Row justify="center" className="mb-4">
              <Button
                type="primary"
                onClick={store.downloadPrealert.bind(store, store.editing?.id)}
                loading={store.loading}
              >
                {t("下载预报文件")}
              </Button>
            </Row>
            <Row justify="center">
              <Block if={!store.hasTakeOf}>
                <span>{t("修改预报文件：")}</span>
                <Upload name="file" action="" accept=".xlsx,.xls,.rar,.zip">
                  <Button icon={<UploadOutlined />} loading={store.loading}>
                    {t("上传附件")}
                  </Button>
                </Upload>
                <span className={styles.tip}>
                  {t("附件支持的格式：'xlsx'，'xls'，'zip'，'rar'")}
                </span>
              </Block>
            </Row>
          </Col>
        </Row>
        <Row justify="end" className="my-4">
          <Button className="mr-4" onClick={store.setEditing.bind(store, null)}>
            {t("取消")}
          </Button>
          <Button type="primary" onClick={() => {}} loading={store.loading}>
            {t("确认无误，提交文件")}
          </Button>
        </Row>
      </Modal>
    );
  }
);

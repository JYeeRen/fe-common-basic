import { CloudUploadOutlined } from "@ant-design/icons";
import { Col, Form, Modal, Row, Spin, Upload, UploadProps } from "antd";
import { observer } from "mobx-react-lite";
import styles from "@components/uploadModal/uploadModal.module.less";
import clsx from "clsx";
import { ImportRes } from "@types";
import { useTranslation } from "@locale";
import localStorage from "@services/localStorage";
import { showUploadResult } from "@components/uploadModal/showUploadResult";
import { SearchSelect } from "@components";
import { useState } from "react";

interface UploadModalProps extends UploadProps {
  open: boolean;
  title: string;
  onDownload: () => void;
  onClose: () => void;
  onCancel?: () => void;
  loading?: boolean;
  fileKey?: string;
  onUpload: (data: FormData) => Promise<ImportRes>;
  tableHeaders: string[];
  onUploadFinsih?: () => void;
}

function UploadModalComponent(props: UploadModalProps) {
  const {
    open,
    title,
    onDownload,
    onClose,
    onCancel,
    loading = false,
    fileKey = "file",
    onUpload,
    tableHeaders,
    onUploadFinsih,
    ...uploadProps
  } = props;

  const [t] = useTranslation();

  const [etd, setEtd] = useState<string>('Asia/Shanghai');
  const [eta, setEta] = useState<string>('Asia/Shanghai');

  const handleUpload: UploadProps["onChange"] = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.originFileObj) {
      return;
    }
    const formData = new FormData();
    formData.append(fileKey, file.originFileObj);
    formData.append("etdLocation", etd);
    formData.append("etaLocation", eta);
    const importRes = await onUpload(formData);
    onClose();
    showUploadResult(importRes, tableHeaders, onUploadFinsih);
  };

  return (
    <Modal
      title={title}
      open={open}
      destroyOnClose
      footer={null}
      onCancel={onCancel ?? onClose}
      maskClosable={false}
      width={700}
    >
      <Spin spinning={loading}>
        <div className={styles.container}>
          <div className={styles.step}>
            <p>{t("第1步")}</p>
            <p className={styles.desc}>
              {t("点击下载空的")}
              <a style={{ color: "#4a69de" }} onClick={onDownload}>
                {t("表格模板")}
              </a>
            </p>
          </div>

          <div className={styles.step}>
            <p>{t("第2步")}</p>
            <p className={styles.desc}>{t("请选择ETA、ETD时区")}</p>
            <div>
              <Form>
                <Row>
                  <Col span={11} offset={1}>
                    <Form.Item label={t("ETD时区")}>
                      <SearchSelect
                        allowClear={false}
                        optionKey="timeZones"
                        value={etd}
                        onChange={setEtd}
                        placeholder={""}
                        options={[
                          { label: '北京时区', value: 'Asia/Shanghai' },
                          { label: '洛杉矶时区', value: 'America/Los_Angeles' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label={t("ETA时区")}>
                      <SearchSelect
                        allowClear={false}
                        optionKey="timeZones"
                        value={eta}
                        onChange={setEta}
                        placeholder={""}
                        options={[
                          { label: '北京时区', value: 'Asia/Shanghai' },
                          { label: '洛杉矶时区', value: 'America/Los_Angeles' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <Upload.Dragger
            disabled={!etd || !eta}
            {...uploadProps}
            beforeUpload={() => false}
            maxCount={1}
            onChange={handleUpload}
            accept=".xlsx,.xls"
            multiple={false}
            // action={`${baseURL}/api/employees/importEmployee`}
            headers={{
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }}
          >
            <Row justify="start">
              <p>{t("第3步")}</p>
            </Row>

            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className={clsx("ant-upload-text", styles.uploadText)}>
              {t("拖拽到此或点击上传表格")}
            </p>
            <p className={clsx("ant-upload-hint", styles.uploadHint)}>
              {t("支持格式：xls、xlsx")}
            </p>
          </Upload.Dragger>
        </div>
      </Spin>
    </Modal>
  );
}

export const UploadModal = observer(UploadModalComponent);

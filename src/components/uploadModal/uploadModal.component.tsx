import { CloudUploadOutlined } from "@ant-design/icons";
import { Modal, Row, Spin, Upload, UploadProps } from "antd";
import { observer } from "mobx-react-lite";
import styles from "./uploadModal.module.less";
import clsx from "clsx";
import { ImportRes } from "@types";
import { showUploadResult } from "./showUploadResult";
import { useTranslation } from "@locale";
import localStorage from "@services/localStorage";
import { ReactNode } from "react";

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
  showDownload?: boolean;
  step1?: ReactNode;
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
    step1,
    ...uploadProps
  } = props;

  const [t] = useTranslation();

  const handleUpload: UploadProps["onChange"] = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.originFileObj) {
      return;
    }
    const formData = new FormData();
    formData.append(fileKey, file.originFileObj);
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
    >
      <Spin spinning={loading}>
        <div className={styles.container}>
          {step1 ?? (
            <div className={styles.step}>
              <p>{t("第1步")}</p>
              <p className={styles.desc}>
                {t("点击下载空的")}
                <a style={{ color: "#4a69de" }} onClick={onDownload}>
                  {t("表格模板")}
                </a>
              </p>
            </div>
          )}

          <Upload.Dragger
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
              <p>{t("第2步")}</p>
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

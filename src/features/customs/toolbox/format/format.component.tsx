import { Container, Row, Upload, UploadProps } from "@components";
import { useTranslation } from "@locale";
import styles from "@components/uploadModal/uploadModal.module.less";
import { CloudUploadOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { net } from "@infra";
import { useState } from "react";

export default function Format() {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false); 
  const [state, setState] = useState<boolean | null>(null);
  const [resFile, setResFile] = useState<{
    fileName: string;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    if (!resFile) {
      return;
    }
    net.clientDownload(resFile.url as any, resFile.fileName);
  };

  const handleUpload: UploadProps["onChange"] = async ({ fileList }) => {
    if (fileList.length === 0) {
      setError(null);
      setState(null);
      setResFile(null);
      return;
    }

    setLoading(true);

    setState(null);
    setError(null);
    setResFile(null);
  
    const file = fileList[0];
    if (!file.originFileObj) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    try {
      const res = await net.post(
        "/api/tools/validateAndCorrectMawbImportTemplate",
        formData
      );
      setResFile(res);
      setState(true);
    } catch (err) {
      if (err instanceof Error) {
        setState(false);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container title={t("格式处理工具")} loading={loading}>
      <div className={styles.container} style={{ width: "600px" }}>
        <div style={{ marginBottom: "10px" }}>
          <Upload.Dragger
            style={{ marginBottom: "10px" }}
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
            <div>
              <Row justify="start">
                <p>{t("第1步")}</p>
              </Row>

              <p
                className={clsx("ant-upload-hint", styles.uploadHint)}
                style={{ width: "100%", textAlign: "start" }}
              >
                {t("请上传需要处理的excel")}
              </p>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className={clsx("ant-upload-text", styles.uploadText)}>
                {t("拖拽到此或点击上传表格")}
              </p>
              <p className={clsx("ant-upload-hint", styles.uploadHint)}>
                {t("支持格式：xls、xlsx")}
              </p>
            </div>
          </Upload.Dragger>
        </div>

        {state != null && (
          <div className={styles.step}>
            <p>{t("第2步")}</p>
            <p className={styles.desc}>
              <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                {t("处理结果")}
              </span>
              {state ? (
                <span style={{ color: "green" }}>{t("处理成功")}</span>
              ) : (
                <span style={{ color: "red" }}>{t("处理失败")}</span>
              )}
          </p>
            {error ? (
              <p className={styles.desc}>
                <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                  {t("失败原因")}
                </span>
                <span>{error}</span>
              </p>
            ) : null}
            {resFile && (
              <div>
                {t("点击下载")}{" "}
                <a onClick={handleDownload} style={{ color: "#1677ff" }}>
                  {t('处理后的表格')}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}

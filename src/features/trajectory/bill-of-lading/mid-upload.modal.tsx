import { Form, Modal, Row, Upload, UploadFile, UploadProps } from "antd";
import { useTranslation } from "@locale";
import { CloudUploadOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useState } from "react";
import styles from "./mid-upload.modal.module.less";
import { BillOfLadingStore } from "./bill-of-lading.store";
import { observer } from "mobx-react-lite";
import { SearchSelect } from "@components";

export default observer(function MidUploadModal({
  store,
}: {
  store: BillOfLadingStore;
}) {
  const [t] = useTranslation();

  const [file, setFile] = useState<UploadFile>();
  const [timeZone, setTimeZone] = useState<string>();

  const handleUpload: UploadProps["onChange"] = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.originFileObj) {
      return;
    }
    setFile(file);
  };

  const handleOk = async () => {
    if (!timeZone) {
      throw new Error("请选择时区");
    }
    if (!file) {
      throw new Error("请上传文件");
    }
    const formData = new FormData();
    formData.append("file", file.originFileObj!);
    formData.append("timeZone", timeZone);
    await store.uploadMID(formData);
    store.hideMidUpload();
  };

  return (
    <Modal
      title={t("回传MID")}
      open={store.midUpload}
      okText={t("确认无误，提交文件")}
      cancelText={t("取消")}
      destroyOnClose
      maskClosable={false}
      afterClose={() => setFile(undefined)}
      onCancel={store.hideMidUpload.bind(store)}
      confirmLoading={store.loading}
      onOk={handleOk}
    >
      <Form.Item label={t("时区")}>
        <SearchSelect
          optionKey="timeZones"
          placeholder={t("选择时区")}
          value={timeZone}
          onChange={setTimeZone}
        />
      </Form.Item>
      <Upload.Dragger
        beforeUpload={() => false}
        maxCount={1}
        onChange={handleUpload}
        accept=".xlsx,.xls"
        multiple={false}
        fileList={file ? [file] : []}
        headers={{
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }}
      >
        <Row justify="start"></Row>

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
    </Modal>
  );
});

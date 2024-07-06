import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "@locale";
import { Button, Upload, UploadFile } from "antd";
import uploadStyles from "./file-upload.module.less";
import { ReactNode, useState } from "react";

interface FileUploadProps {
  loading?: boolean;
  title: string | ReactNode;
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
  multiple?: boolean;
  maxCount?: number;
  desc?: string;
  accept?: string;
}

export const FileUpload = (props: FileUploadProps) => {
  const {
    loading,
    title,
    value,
    onChange,
    multiple = false,
    maxCount,
    desc,
    accept = ".xlsx,.xls",
  } = props;
  const [t] = useTranslation();
  const [files, setFiles] = useState(value ?? []);
  const handleChange = (fileList: UploadFile[]) => {
    setFiles(fileList);
    onChange?.(fileList);
  };

  return (
    <div className={uploadStyles.uploadContainer}>
      <Upload
        name="file"
        action=""
        accept={accept}
        multiple={multiple}
        maxCount={maxCount}
        beforeUpload={() => {
          return false;
        }}
        fileList={files}
        onChange={({ fileList }) => handleChange(fileList)}
      >
        <div className="flex flex-row">
          <span>{title}</span>
          <div className="flex flex-col">
            <Button
              icon={<UploadOutlined />}
              loading={loading}
              onClick={() => {
                handleChange([]);
              }}
            >
              {t("上传附件")}
            </Button>
            <span className={uploadStyles.tip}>
              {desc ?? t("附件支持的格式：'xlsx'，'xls'")}
            </span>
          </div>
        </div>
      </Upload>
    </div>
  );
};

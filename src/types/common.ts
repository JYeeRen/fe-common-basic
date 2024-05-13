import type { GetProp, UploadProps } from "antd";

export interface Option {
  val: string;
  id: number | string;
}

export type Options = {
  value: number | string;
  label: string;
}[];


export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
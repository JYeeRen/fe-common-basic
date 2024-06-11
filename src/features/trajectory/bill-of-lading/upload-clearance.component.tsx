import { observer } from "mobx-react-lite";
import {
  Button,
  FileUpload,
  Form,
  Modal,
  Row,
  SubmitButton,
} from "@components";
import { useTranslation } from "@locale";
// import { uniq } from "lodash";
// import { useCallback } from "react";
import { ClearanceStore } from "./clearance.store";

interface UploadClearanceProps {
  store: ClearanceStore;
  refreshTable: () => void;
  onCancel: () => void;
  open: boolean;
  uploadingId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOk: (files: any[]) => void;
}

export const UploadClearance = observer((props: UploadClearanceProps) => {
  const { store, open, onCancel, handleOk } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  // const otherError = useCallback(
  //   (errors: { number: string; reason: string }[]) => {
  //     Modal.confirm({
  //       width: 600,
  //       title: t("警告！"),
  //       content: (
  //         <>
  //           <p>{t("上传文件内存在错误，请修改后重新上传。")}</p>
  //           <div className="my-4">
  //             <p style={{ color: "#c9c9c9" }}>{t("错误的提单号如下：")}</p>
  //             {errors.map((item, idx) => (
  //               <p key={`${idx}_${item.number}`} style={{ color: "#c9c9c9" }}>
  //                 {item.number} {item.reason}
  //               </p>
  //             ))}
  //           </div>
  //         </>
  //       ),
  //       okText: t("复制单号"),
  //       cancelText: t("放弃录入"),
  //       onOk: async () => {
  //         await navigator.clipboard.writeText(
  //           uniq(errors.map((i) => i.number)).join("\n")
  //         );
  //       },
  //       onCancel: () => {
  //         // store.hideUploadClearance();
  //       },
  //     });
  //   },
  //   []
  // );

  const onOk = async () => {
    const { files } = form.getFieldsValue();
    handleOk(files);
  };

  return (
    <Modal
      open={open}
      title={t("文件上传")}
      width={550}
      destroyOnClose
      onCancel={onCancel}
      maskClosable={false}
      footer={null}
      afterClose={form.resetFields}
    >
      <Form form={form}>
        <div className="my-10">
          <Form.Item noStyle name="files" rules={[{ required: true, type: 'array', min: 1 }]}>
            <FileUpload
              multiple
              title={<span className="mr-4">{t("请上传文件")}:</span>}
              desc={t("附件支持的格式：'jpg','jpeg','png','pdf'")}
              accept=".jpg,.jpeg,.png,.pdf"
              loading={store.loading}
            />
          </Form.Item>
        </div>
        <Row justify="end" className="my-4">
          <Button className="mr-4" onClick={onCancel}>
            {t("取消")}
          </Button>
          <SubmitButton form={form} onClick={onOk} loading={store.loading}>
            {t("确认无误，提交文件")}
          </SubmitButton>
        </Row>
      </Form>
    </Modal>
  );
});

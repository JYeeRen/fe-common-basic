import { observer } from "mobx-react-lite";
import { BillOfLadingStore } from "./bill-of-lading.store";
import {
  Button,
  FileUpload,
  Form,
  Modal,
  Row,
  SearchSelect,
  SubmitButton,
} from "@components";
import { useTranslation } from "@locale";
import { chain, uniq } from "lodash";
import { useCallback } from "react";
import { UploadRes } from "./type";

interface UploadModalProps {
  store: BillOfLadingStore;
  refreshTable: () => void;
}

export const UploadModal = observer((props: UploadModalProps) => {
  const { store, refreshTable } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();

  const onCancel = () => {
    store.hideUploadModal();
  };

  const updateConfirm = useCallback(
    async (timeChange: { number: string; reason: string }[]) => {
      const content = (
        <>
          <p>
            {t(
              "上传文件内录入的轨迹时间与旧时间不一致，不一致的数据单号如下，请查看后确认是否覆盖原有轨迹时间？"
            )}
          </p>
          <p>
            <span style={{ display: "inline-block", color: "orange" }}>
              {t("注意：")}
            </span>
            <span>
              {t(
                "确认修改后，将刷新上传时间，影响时效计算，该操作不可逆，请谨慎操作！"
              )}
            </span>
          </p>
          <div className="my-4">
            <p style={{ color: "#c9c9c9" }}>{t("不一致的提单号如下：")}</p>
            {chain(timeChange)
              .map("number")
              .uniq()
              .value()
              .map((number, idx) => (
                <p key={`${idx}_${number}`} style={{ color: "#c9c9c9" }}>
                  {number}
                </p>
              ))}
          </div>
        </>
      );

      return new Promise((resolve) => {
        Modal.confirm({
          width: 500,
          maskClosable: false,
          footer: (
            <Row justify="end" className="my-4">
              <Button
                className="mr-4"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    uniq(timeChange.map((i) => i.number)).join("\n")
                  );
                  Modal.destroyAll();
                  resolve(false);
                }}
              >
                {t("复制单号")}
              </Button>
              <Button
                className="mr-4"
                onClick={() => {
                  Modal.destroyAll();
                  store.hideUploadModal();
                  resolve(false);
                }}
              >
                {t("放弃录入")}
              </Button>
              <Button
                className="mr-4"
                type="primary"
                onClick={() => {
                  Modal.destroyAll();
                  resolve(true);
                }}
              >
                {t("确认上传")}
              </Button>
            </Row>
          ),
          title: t("操作确认"),
          content,
        });
      });
    },
    []
  );

  const over24Confirm = useCallback(async (overtime: { number: string }[]) => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: t("操作确认"),
        content: (
          <div>
            <p>
              {t(
                "上传文件内录入的轨迹发生时间已超出当前时间24小时以上，是否确认上传轨迹？"
              )}
            </p>
            <p>{t("超时的数据单号如下：")}</p>
            {chain(overtime)
              .map("number")
              .uniq()
              .value()
              .map((number, idx) => (
                <p key={`${idx}_${number}`}>{number}</p>
              ))}
          </div>
        ),
        footer: (
          <Row justify="end" className="my-4">
            <Button
              className="mr-4"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  uniq(overtime.map((i) => i.number)).join("\n")
                );
                Modal.destroyAll();
                resolve(false);
              }}
            >
              {t("复制单号")}
            </Button>
            <Button
              className="mr-4"
              onClick={() => {
                Modal.destroyAll();
                store.hideUploadModal();
                resolve(false);
              }}
            >
              {t("放弃录入")}
            </Button>
            <Button
              className="mr-4"
              type="primary"
              style={{ background: "red" }}
              onClick={() => {
                Modal.destroyAll();
                resolve(true);
              }}
            >
              {t("确认上传")}
            </Button>
          </Row>
        ),
      });
    });
  }, []);

  const headerError = useCallback(() => {
    Modal.error({
      title: t("操作确认"),
      content: t(
        "文件上传失败。文件内数据字段表头与模板不一致，请下载批量上传模板制作文件。"
      ),
      okText: t("确认"),
    });
  }, []);

  const otherError = useCallback(
    (errors: { number: string; reason: string }[]) => {
      Modal.confirm({
        title: t("警告！"),
        content: (
          <>
            <p>{t("上传文件内存在错误，请修改后重新上传。")}</p>
            <div className="my-4">
              <p style={{ color: "#c9c9c9" }}>{t("错误的提单号如下：")}</p>
              {errors.map((item, idx) => (
                <p key={`${idx}_${item.number}`} style={{ color: "#c9c9c9" }}>
                  {item.number} {item.reason}
                </p>
              ))}
            </div>
          </>
        ),
        okText: t("复制单号"),
        cancelText: t("放弃录入"),
        onOk: async () => {
          await navigator.clipboard.writeText(
            uniq(errors.map((i) => i.number)).join("\n")
          );
        },
        onCancel: () => {
          store.hideUploadModal();
        },
      });
    },
    []
  );

  const operationConfirm = useCallback((res: UploadRes) => {
    const { failed, total, success } = res;
    Modal.confirm({
      okText: t('确认'),
      cancelText: t('复制未完成单号'),
      title: t("操作确认"),
      onOk: () => {
        refreshTable();
      },
      onCancel: async () => {
        await navigator.clipboard.writeText(
          uniq(failed.map((i) => i.number)).join("\n")
        );
      },
      content: (
        <>
          <p style={{ color: "#c7c7c7" }}>
            {t("全部上传数据：{{n}}条。", { n: total })}
          </p>
          <p style={{ color: "#c7c7c7" }}>
            {t("完成上传数据：{{n1}}条。未上传数据：{{n2}}条。", {
              n1: success,
              n2: total - success,
            })}
          </p>
          <p style={{ color: "#c7c7c7" }}>{t("未完成数据提单号如下：")}</p>
          {failed.map((item, index) => (
            <p key={`${index}_${item.number}`} style={{ color: "#c7c7c7" }}>
              {item.number}
            </p>
          ))}
        </>
      ),
    });
  }, []);

  const onOk = async () => {
    const { timeZone, file } = form.getFieldsValue();

    const formdata = new FormData();
    formdata.append("file", file[0].originFileObj);
    formdata.append("timeZone", timeZone);
    const res = await store.checkMawbTrackFile(formdata);

    if (res.formatError.length) {
      headerError();
      return;
    }

    if (res.numberError.length) {
      otherError(res.numberError);
      return;
    }

    if (res.timeChange.length > 0 && !(await updateConfirm(res.timeChange))) {
      return;
    }

    if (res.timeout.length && !(await over24Confirm(res.timeout))) {
      return;
    }

    const uploadRes = await store.uploadMawbTrack(formdata);
    store.hideUploadModal();
    operationConfirm(uploadRes);
  };

  return (
    <Modal
      open={store.uploadModalVisible}
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
          <Form.Item
            label={t("请选择本次上传轨迹时间所属时区")}
            name="timeZone"
            rules={[{ required: true }]}
          >
            <SearchSelect optionKey="timeZones" placeholder={t("请选择时区")} />
          </Form.Item>
          <Form.Item noStyle name="file" rules={[{ required: true }]}>
            <FileUpload
              title={<span className="mr-4">{t("请上传附件")}:</span>}
              maxCount={1}
            />
          </Form.Item>
          <div style={{ display: "inline-block", color: "orange" }}>
            {t("注意：")}
          </div>
          <p>
            {t("请确保上传的表格数据表头字段正确。")}（
            <a
              style={{
                color: "#1677ff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={store.downloadTemplate.bind(store)}
            >
              {t("点击可下载模板进行制作。")}
            </a>
            ）
          </p>
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

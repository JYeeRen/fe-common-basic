import { Modal, TableColumnsType } from "antd";
import { Table } from '../table/table';
import { v4 } from "uuid";
import styles from "./uploadModal.module.less";
import { ImportRes } from "@types";
import { Block } from "../block/block";
import { t } from "@locale";
import { net } from "@infra";

export function showUploadResult(
  importRes: ImportRes,
  headers: string[],
  onUploadFinsih?: () => void
) {
  const { total = 0, success = 0, rejected, fileName, url } = importRes;

  const download = () => net.clientDownload(url, fileName);

  const columns: TableColumnsType<any> = headers.map(
    (name, idx) => ({
      key: `row[${idx.toString()}]`,
      title: name,
      render: (_, row) => `${row.row[idx] ?? ''}`,
    })
  );

  return Modal.confirm({
    maskClosable: false,
    width: 700,
    cancelButtonProps: { style: { display: "none" } },
    title: t("操作确认"),
    content: (
      <>
        <p className={styles.tips}>{t("上传数据：{{n}}条。", { n: total })}</p>
        <p className={styles.tips}>
          {t("上传成功：{{n}}条。", { n: success })}
        </p>
        <p className={styles.tips}>
          {t("上传失败：{{n}}条。", { n: total - success })}
        </p>
        <Block if={total !== success}>
          <p className={styles.error}>
            {t("失败数据如下，请检查后重新上传：")}
            <a style={{ color: '#4a69de' }} onClick={download}>{t("下载失败数据表格")}</a>
          </p>
          <Table
            tableKey="商品详细信息"
            highlight
            widthFit
            bordered
            tableLayout="auto"
            dataSource={rejected}
            size="small"
            className={styles.resTable}
            rowKey={() => v4()}
            minHeight={72 + 15}
            maxHeight={400}
            columns={[...columns, { key: "reason", title: t("失败原因") }]}
          />
        </Block>
      </>
    ),
    onOk: async () => {
      onUploadFinsih?.();
    },
  });
}

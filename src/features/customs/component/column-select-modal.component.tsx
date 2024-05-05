import { Modal, Transfer, TransferProps } from "@components";
import { useTranslation } from "@locale";
import { TemplateColOption } from "../types";
import { useCallback, useEffect, useState } from "react";
import styles from "./column-select-modal.module.less";
import { observer } from "mobx-react-lite";

interface ColumnSelectModalProps {
  templateCols: TemplateColOption[];
  targetKeys: string[];
  open: boolean;
  onOk: (keys: string[]) => void;
  onCancel: () => void;
}

export const ColumnSelectModal = observer((props: ColumnSelectModalProps) => {
  const { templateCols, targetKeys, open, onOk, onCancel } = props;
  const [t] = useTranslation();
  const [selectedKeys, setSelectedKeys] =
    useState<TransferProps["targetKeys"]>([]);

  useEffect(() => {
    setSelectedKeys(targetKeys);
  }, [targetKeys]);

  const filterOption = useCallback(
    (inputValue: string, option: TemplateColOption) =>
      option.cnName.indexOf(inputValue) > -1 ||
      option.enName.indexOf(inputValue) > -1,
    []
  );

  const handleOk = () => {
    onOk((selectedKeys ?? []) as string[]);
  };

  const handleChange: TransferProps["onChange"] = useCallback(
    (targetKeys: TransferProps["targetKeys"]) => {
      setSelectedKeys(targetKeys);
    },
    []
  );

  return (
    <Modal
      wrapClassName={styles.modalwrapper}
      width={700}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      title={t("请选择导出列")}
      okText={t("保存")}
      cancelText={t("取消")}
      styles={{
        body: { height: "400px" },
      }}
      maskClosable={false}
      destroyOnClose
    >
      <div className="flex justify-center align-middle h-full">
        <Transfer
          className={styles.transfer}
          dataSource={templateCols}
          showSearch
          filterOption={filterOption}
          targetKeys={selectedKeys}
          listStyle={{ width: 300 }}
          locale={{
            itemUnit: t("项"),
            itemsUnit: t("项"),
            searchPlaceholder: t("请输入搜索内容"),
          }}
          titles={[t("待选项"), t("已选项")]}
          onChange={handleChange}
          render={(item) => item.cnName}
        />
      </div>
    </Modal>
  );
});

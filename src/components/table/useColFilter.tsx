import { FilterOutlined } from "@ant-design/icons";
import { Item, TableColSettings } from "@components/colManager";
import { useTranslation } from "@locale";
import { Button, TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import sStorage from '@services/localStorage';
import { makeAutoObservable } from "mobx";

class ColConfigStore {
  tbColConfig: Record<string, string[]> = {};

  constructor() {
    makeAutoObservable(this);
    const tbColConfig = sStorage.getItem('table.col.config');
    this.tbColConfig = tbColConfig ?? {};
  }

  setColConfig(key: string, value: string[]) {
    const config = sStorage.getItem('table.col.config') ?? {};
    const newConfig = { ...config, [key]: value };
    this.tbColConfig = newConfig;
    sStorage.setItem('table.col.config', newConfig);
  }

  getColConfig(key: string) {
    return this.tbColConfig[key];
  }
}

export const colConfigStore = new ColConfigStore();

const use = (tableKey: string, config: TableColumnsType) => {
  const [visible, setVisible] = useState(false);
  const colConfig = colConfigStore.getColConfig(tableKey);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(colConfig ?? []);

  const fieldColumns = useMemo<Item[]>(
    () =>
      config.map((col) => ({
        key: col.key as string,
        label: col.title as string,
      })),
    [config]
  );

  return {
    open: () => setVisible(true),
    visible,
    onClose: () => setVisible(false),
    fieldColumns,
    selectedKeys,
    setShowColumns: (keys: string[]) => {
      setSelectedKeys(keys);
      colConfigStore.setColConfig(tableKey, keys);
    },
  };
};

interface ColSelectorProps {
  tableKey: string;
  config: TableColumnsType;
}

export const ColSelector = (props: ColSelectorProps) => {
  const [t] = useTranslation();
  const { open, fieldColumns, visible, onClose, selectedKeys, setShowColumns } =
    use(props.tableKey, props.config);

  return (
    <>
      <Button onClick={open} type="link" icon={<FilterOutlined />}>{t("设置列表字段")}</Button>
      {visible && (
        <TableColSettings
          filter
          title={t("设置列表字段")}
          fieldColumns={fieldColumns}
          visible={visible}
          onClose={onClose}
          selectedKeys={selectedKeys}
          setShowColumns={(keys) => setShowColumns(keys as string[])}
        />
      )}
    </>
  );
};

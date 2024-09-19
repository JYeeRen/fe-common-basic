import { TableProps } from "antd";
import { Key, useState } from "react";
import styles from './styles.module.less';
import { getRowKey } from "./getRowKey";

export function useHighlight(enable = false, { rowKey }: TableProps) {
  const [highlight, setHighlight] = useState<Key[]>([]);

  const onRowClick = (key: Key) => {
    setHighlight([key]);
  };

  const rowClassName: TableProps['rowClassName'] = (record) => {
    const key = getRowKey(rowKey, record);
    if (highlight.includes(key)) {
      return styles.highlight;
    }
    return '';
  };

  if (!enable) {
    return;
  }

  return {
    onRowClick,
    rowClassName
  };
}
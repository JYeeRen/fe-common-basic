import { TableProps } from "antd";

export const getRowKey = (rowKey: TableProps['rowKey'], record: any) => {
  if (typeof rowKey === 'function') {
    return rowKey(record);
  }
  
  return record[rowKey ?? 'id'];
};

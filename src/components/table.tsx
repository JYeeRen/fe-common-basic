import { TableProps, Table as AntTable } from "antd";

export function Table(props: TableProps) {
  return (
    <AntTable
      {...props}
    />
  );
}
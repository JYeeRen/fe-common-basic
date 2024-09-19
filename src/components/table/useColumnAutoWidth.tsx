import { TableColumnsType, TableColumnType } from "antd";
import { get } from "lodash";
import { useMemo } from "react";

function getTextWidth(text: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;
  context.font = "16px Arial";
  const textmetrics = context.measureText(text);
  return textmetrics.width;
}


export function useColumnAutoWidth<T>(
  columns: TableColumnType<T>[],
  dataSource: T[],
  enable = false
) {
  const colWithWidth = useMemo(() => {
    if (!enable) {
      return columns;
    }
    const cols: TableColumnsType = columns.map((col) => {
      const { dataIndex, title, width: predefWidth, filterDropdown, sorter } = col;
      if (predefWidth) {
        return col;
      }

      const titleWidth = getTextWidth(title as string);

      const maxValue = dataSource.reduce((acc, row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = get(row, dataIndex as any) ?? "";
        acc = acc.length > value.length ? acc : value;
        return acc;
      }, "");

      let width =
        Math.ceil(Math.max(titleWidth ?? 100, getTextWidth(maxValue) ?? 0)) +
        20;

      if (filterDropdown) {
        width += 30;
      }
      if (sorter) {
        width += 30;
      }
      return { ...col, width };
    });
    return cols;
  }, [columns, dataSource, enable]);

  return colWithWidth;
}

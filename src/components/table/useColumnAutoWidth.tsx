import { TableColumnsType, TableColumnType } from "antd";
import { get } from "lodash";
import { useMemo } from "react";

function getTextWidth(text: string = '') {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;
  context.font = "16px Arial";
  const textmetrics = context.measureText(text);
  let width = textmetrics.width;
  return width;
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

      let idx = 0;
      const maxValue = dataSource.reduce((acc, row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value = get(row, dataIndex as any) ?? "";
        if ((col as any).renderWidth) {
          value = col.render?.(value, row, idx) ?? '';
        }
        acc = acc.length > value.length ? acc : value;
        idx += 1;
        return acc;
      }, "");

      let width =
        Math.ceil(Math.max(titleWidth ?? 100, getTextWidth(maxValue) ?? 0)) +
        20;

      if (filterDropdown) {
        width += 22;
      }
      if (sorter) {
        width += 22;
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

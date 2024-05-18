import { Block } from "@components";
import { useHeight } from "@hooks";
import {
  TableProps,
  Table as AntTable,
  Pagination,
  TableColumnType,
  TableColumnsType,
} from "antd";
import { get } from "lodash";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

function getTextWidth(text: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;
  context.font = "16px Arial";
  const textmetrics = context.measureText(text);
  return textmetrics.width;
}

function useColumnAutoWidth<T>(
  columns: TableColumnType<T>[],
  dataSource: T[],
  enable = false
) {
  const colWithWidth = useMemo(() => {
    if (!enable) {
      return columns;
    }
    const cols: TableColumnsType = columns.map((col) => {
      const { dataIndex, title, width: predefWidth } = col;
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

      const width =
        Math.ceil(Math.max(titleWidth ?? 100, getTextWidth(maxValue) ?? 0)) +
        20;
      return { ...col, width };
    });
    return cols;
  }, [columns, dataSource, enable]);

  return colWithWidth;
}

interface ExternalTableProps {
  widthFit?: boolean;
  autoHeight?: boolean;
  maxHeight?: number;
}

export const Table = observer((props: TableProps & ExternalTableProps) => {
  const {
    pagination,
    scroll,
    columns: columnsDefs,
    dataSource,
    widthFit,
    autoHeight = true,
    maxHeight = 250,
    ...restProps
  } = props;

  const columns = useColumnAutoWidth(
    columnsDefs ?? [],
    dataSource as unknown[],
    widthFit ?? false
  );

  const [adaptiveHeight, bounding] = useHeight("#table-container");

  const heights = useMemo(() => {
    const container = Math.max(350, adaptiveHeight - 36);
    let table: number | undefined = Math.max(maxHeight, adaptiveHeight - 150);
    if (bounding?.height && bounding.height < table) {
      table = undefined;
    }
    return { container, table };
  }, [adaptiveHeight, bounding?.height, maxHeight]);

  const containerStyle = useMemo(
    () => {
      if (!autoHeight) {
        return undefined;
      }
      return { height: `${heights.container}px` };
    },
    [autoHeight, heights.container]
  );

  return (
    <div
      id="table-container"
      className="w-full overflow-hidden"
      style={containerStyle}
    >
      <AntTable
        {...restProps}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: heights.table, x: "max-content", ...scroll }}
        pagination={false}
      />
      <Block if={Boolean(pagination)}>
        <Pagination
          className="flex justify-end mt-4 mr-4 mb-8"
          {...pagination}
        />
      </Block>
    </div>
  );
});

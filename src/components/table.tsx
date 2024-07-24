import { Block } from "@components";
import {
  TableProps,
  Table as AntTable,
  Pagination,
  TableColumnType,
  TableColumnsType,
} from "antd";
import { get, sumBy } from "lodash";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { Resizable } from "re-resizable";

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
      const { dataIndex, title, width: predefWidth, filterDropdown } = col;
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
        width += 30
      }
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
  enableResize?: false;
  useColWidth?: boolean;
}

export const Table = observer((props: TableProps & ExternalTableProps) => {
  const {
    pagination,
    scroll,
    columns: columnsDefs,
    dataSource,
    widthFit,
    enableResize,
    // autoHeight = true,
    // maxHeight = 250,
    useColWidth,
    ...restProps
  } = props;

  const columns = useColumnAutoWidth(
    columnsDefs ?? [],
    dataSource as unknown[],
    widthFit ?? false
  );

  // const [topToTop, bounding] = useHeight("#table-container");

  // const heights = useMemo(() => {
  //   const container = Math.max(400, topToTop - 36);
  //   let table: number | undefined = topToTop - 150;
  //   // 为了显示最小 100
  //   table = Math.max(150, table);
  //   // 最大不超过 maxHeight
  //   table = Math.min(maxHeight, table);

  //   if (bounding?.height && bounding.height < table) {
  //     table = undefined;
  //   }
  //   return { container, table };
  // }, [topToTop, bounding?.height, maxHeight]);

  // const containerStyle = useMemo(() => {
  //   if (!autoHeight) {
  //     return undefined;
  //   }
  //   return { height: `${heights.container}px` };
  // }, [autoHeight, heights.container]);

  const [height, setHeight] = useState(window.innerHeight - 260);
  const [prevHeight, setPrevHeight] = useState(0);

  return (
    // <div
    //   id="table-container"
    //   className="w-full"
    //   // style={containerStyle}
    // >
      <Resizable
        enable={enableResize}
        className="resizable"
        style={{
          display: "flex",
          flexDirection: "column",
          border: "solid 1px #ddd",
          marginBottom: '30px'
        }}
        maxWidth="100%"
        minWidth="100%"
        minHeight={300}
        defaultSize={{
          width: "100%",
          height: "auto",
        }}
        onResize={(_, __, ___, d) => {
          setPrevHeight(d.height);
          setHeight(Math.max(height + d.height- prevHeight, 300));
        }}
        onResizeStop={() => {
          setPrevHeight(0);
        }}
      >
          <AntTable
            {...restProps}
            columns={columns}
            dataSource={dataSource}
            scroll={{ y: height - 90, x: useColWidth ? sumBy(columns, 'width') : "max-content", ...scroll }}
            pagination={false}
          />
          <Block if={Boolean(pagination)}>
            <Pagination
              className="flex justify-end mt-4 mr-4 mb-8"
              {...pagination}
            />
          </Block>
      </Resizable>
    // </div>
  );
});

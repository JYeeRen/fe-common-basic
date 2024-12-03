import { Block } from "@components";
import {
  TableProps,
  Table as AntTable,
  Pagination,
} from "antd";
import { compact, keyBy, sumBy } from "lodash";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { Resizable } from "re-resizable";
import { useColumnAutoWidth } from "./useColumnAutoWidth";
import { useHighlight } from "./useHighlight";
import { getRowKey } from "./getRowKey";
import { colConfigStore } from "./useColFilter";

interface ExternalTableProps {
  widthFit?: boolean;
  autoHeight?: boolean;
  tableHeight?: number
  maxHeight?: number;
  minHeight?: number;
  enableResize?: false;
  useColWidth?: boolean;
  highlight?: boolean;
  tableKey?: string;
}

export const Table = observer((props: TableProps & ExternalTableProps) => {
  const {
    tableKey,
    pagination,
    scroll,
    columns: columnsDefs,
    dataSource,
    widthFit,
    enableResize,
    tableHeight,
    minHeight,
    // autoHeight = true,
    // maxHeight = 250,
    rowKey,
    useColWidth,
    highlight,
    ...restProps
  } = props;


  const columnsDefsDict = useMemo(() => keyBy(columnsDefs, "key"), [columnsDefs]);
  const colConfig = colConfigStore.getColConfig(tableKey ?? '') ?? [];
  const filteredColumns = colConfig.length > 0 ? compact(colConfig.map(k => columnsDefsDict[k])) : columnsDefs;

  const columns = useColumnAutoWidth(
    filteredColumns ?? [],
    dataSource as unknown[],
    widthFit ?? false
  );

  const highlightProps = useHighlight(highlight, props);

  const [height, setHeight] = useState(window.innerHeight - 260);
  const [prevHeight, setPrevHeight] = useState(0);

  return (
    <Resizable
      enable={enableResize}
      className="resizable"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "solid 1px #ddd",
        marginBottom: "30px",
      }}
      maxWidth="100%"
      minWidth="100%"
      minHeight={minHeight ?? 300}
      defaultSize={{
        width: "100%",
        height: "auto",
      }}
      onResize={(_, __, ___, d) => {
        setPrevHeight(d.height);
        setHeight(Math.max(height + d.height - prevHeight, 300));
      }}
      onResizeStop={() => {
        setPrevHeight(0);
      }}
    >
      <AntTable
        rowKey={rowKey}
        onRow={(record) => ({
          onClick: () => {
            highlightProps?.onRowClick(getRowKey(rowKey, record))
          }
        })}
        rowClassName={highlightProps?.rowClassName}
        {...restProps}
        columns={columns}
        dataSource={dataSource}
        scroll={{
          y: height - 90,
          x: useColWidth ? sumBy(columns, "width") : "max-content",
          ...scroll,
        }}
        pagination={false}
      />
      <Block if={Boolean(pagination)}>
        <Pagination
          className="flex justify-end mt-4 mr-4 mb-8"
          {...pagination}
        />
      </Block>
    </Resizable>
  );
});

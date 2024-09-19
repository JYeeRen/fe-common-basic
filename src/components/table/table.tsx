import { Block } from "@components";
import {
  TableProps,
  Table as AntTable,
  Pagination,
} from "antd";
import { sumBy } from "lodash";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Resizable } from "re-resizable";
import { useColumnAutoWidth } from "./useColumnAutoWidth";
import { useHighlight } from "./useHighlight";
import { getRowKey } from "./getRowKey";


interface ExternalTableProps {
  widthFit?: boolean;
  autoHeight?: boolean;
  maxHeight?: number;
  enableResize?: false;
  useColWidth?: boolean;
  highlight?: boolean;
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
    rowKey,
    useColWidth,
    highlight,
    ...restProps
  } = props;

  const columns = useColumnAutoWidth(
    columnsDefs ?? [],
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
      minHeight={300}
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

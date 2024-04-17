import { forwardRef, useMemo, useRef } from "react";
import { DataEditor, DataEditorRef } from "@glideapps/glide-data-grid";
import { AnyObject, DataGridProps } from "./type";
import { useDataGrid } from "./useDataGrid";
import { useAsyncData } from "./useAsyncData";

import "@glideapps/glide-data-grid/dist/index.css";

export function DataGridImpl<R extends AnyObject>(props: DataGridProps<R>) {
  const { columns = [], dataSource = [], getData } = props;
  const ref = useRef<DataEditorRef>(null);
  const dataRef = useRef<R[]>(dataSource);
  dataRef.current = dataSource;

  const {
    columns: gridColumns,
    getCellContent,
    onColumnResize,
    onColumnMoved,
  } = useDataGrid(columns, dataRef);

  const { onVisibleRegionChanged, rows } = useAsyncData<R>(
    100,
    getData,
    ref,
    dataRef
  );

  const theme = useMemo(
    () => ({
      baseFontStyle: "0.8125rem",
      headerFontStyle: "600 0.8125rem",
      editorFontSize: "0.8125rem",
    }),
    []
  );

  return (
    <DataEditor
      ref={ref}
      columns={gridColumns}
      getCellContent={getCellContent}
      onColumnResize={onColumnResize}
      onColumnMoved={onColumnMoved}
      onVisibleRegionChanged={onVisibleRegionChanged}
      height="100%"
      width="100%"
      rowMarkers="clickable-number"
      rows={props.rows ?? rows ?? dataSource.length}
      overscrollX={0}
      overscrollY={0}
      theme={theme}
      smoothScrollX
      smoothScrollY
      getCellsForSelection
      isDraggable={false}
      scaleToRem
      maxColumnWidth={1000}
      maxColumnAutoWidth={1000}
    />
  );
}

const DataGrid = forwardRef(DataGridImpl);

export default DataGrid;

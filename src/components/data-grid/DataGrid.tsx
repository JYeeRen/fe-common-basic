/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useRef, useState } from "react";
import {
  DataEditor,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
  DataEditorProps
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import csvData from "./output.json";
import { AnyObject, Column } from "./type";
import { COLUMNS } from "./test_columns";

const data = csvData as AnyObject;

export type GridColumnWithGetContent = GridColumn & {
  getContent: () => GridCell;
};

function getGridColumn(col: Column): GridColumn {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getContent, ...rest } = col;
  return { ...rest };
}

interface DataGridProps<RecordType = any> {
  dataSource?: RecordType[];
  columns?: Column[];
}

export function DataGrid<RecordType extends AnyObject = AnyObject>(props: DataGridProps<RecordType>) {

  const { dataSource = data, columns = COLUMNS } = props;

  const commonCellRender = (value: any = ''): GridCell => {
    return {
      kind: GridCellKind.Text,
      displayData: value,
      data: value,
      allowOverlay: true,
      readonly: true,
    };
  };


  const [colsMap, setColsMap] = useState(columns);

  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number, colIndex: number) => {
      setColsMap((prevColsMap) => {
        prevColsMap.splice(colIndex, 1, { ...column, width: newSize })
        return [...prevColsMap];
      });
    },
    []
  );

  const onColumnMoved = useCallback((startIndex: number, endIndex: number) => {
    setColsMap((prevColsMap) => {
      const cols = [...prevColsMap];
      const [removed] = cols.splice(startIndex, 1);
      cols.splice(endIndex, 0, removed);
      return cols;
    });
  }, [])

  const cols = useMemo(() => {
    return colsMap.map(getGridColumn);
  }, [colsMap]);

  const colsMapRef = useRef(colsMap);
  colsMapRef.current = colsMap;
  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const { id } = colsMapRef.current[col];
      return (colsMapRef.current[col].getContent ?? commonCellRender)(id && dataSource[row][id], dataSource[row], row);
    },
    []
  );

  const defaultProps: Partial<DataEditorProps> = {
    smoothScrollX: true,
    smoothScrollY: true,
    getCellsForSelection: true,
    width: "100%",
}

  return (
    <DataEditor
      {...defaultProps}
      height={500}
      rowMarkers="clickable-number"
      columns={cols}
      scaleToRem
      maxColumnAutoWidth={500}
      maxColumnWidth={1000}
      getCellContent={getCellContent}
      rows={dataSource.length}
      onColumnResize={onColumnResize}
      isDraggable={false}
      onColumnMoved={onColumnMoved}
      theme={useMemo(
        () => ({
          baseFontStyle: "0.8125rem",
          headerFontStyle: "600 0.8125rem",
          editorFontSize: "0.8125rem",
        }),
        []
      )}
    />
  );
}

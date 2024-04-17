/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DataEditorProps,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnyObject, ColSchema } from "./type";

function getGridColumn(col: ColSchema) {
  return { ...col };
}

export function useDataGrid<R extends AnyObject>(
  _schemas: ColSchema[],
  dataRef: MutableRefObject<R[]>
) {
  const [schemas, setSchemas] = useState(_schemas);
  const schemasRef = useRef(schemas);

  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number, colIndex: number) => {
      setSchemas((prevCols) => {
        const colSchema = schemas[colIndex];
        prevCols.splice(colIndex, 1, { ...colSchema, width: newSize });
        return [...prevCols];
      });
    },
    [schemas]
  );

  const onColumnMoved = useCallback((startIndex: number, endIndex: number) => {
    setSchemas((prevCols) => {
      const cols = [...prevCols];
      const [removed] = cols.splice(startIndex, 1);
      cols.splice(endIndex, 0, removed);
      return cols;
    });
  }, []);

  const memoColumns = useMemo(() => schemas.map(getGridColumn), [schemas]);

  const toCell = useCallback((rowData: R, col: number): GridCell => {
    const colSchema = schemasRef.current[col];
    const val = `${rowData[colSchema.id]}`;
    return {
      kind: GridCellKind.Text,
      data: rowData[colSchema.id],
      displayData: val,
      allowOverlay: true,
      readonly: true,
    };
  }, []);

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const record = dataRef.current[row];
      if (record !== undefined) {
        return toCell(record, col);
      }
      return {
        kind: GridCellKind.Loading,
        allowOverlay: false,
      };
    },
    [dataRef, toCell]
  );

  const theme = useMemo(
    () => ({
      baseFontStyle: "0.8125rem",
      headerFontStyle: "600 0.8125rem",
      editorFontSize: "0.8125rem",
    }),
    []
  );

  const defaultProps: Partial<DataEditorProps> = useMemo(
    () => ({
      theme,
      smoothScrollX: true,
      smoothScrollY: true,
      getCellsForSelection: true,
      width: "100%",
      isDraggable: false,
      scaleToRem: true,
      maxColumnWidth: 1000,
      maxColumnAutoWidth: 1000
    }),
    []
  );

  return {
    columns: memoColumns,
    getCellContent,
    onColumnResize,
    onColumnMoved,
    ...defaultProps,
  };
}

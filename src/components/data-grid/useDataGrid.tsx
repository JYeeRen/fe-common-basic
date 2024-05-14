/* eslint-disable @typescript-eslint/no-explicit-any */
import {
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
  const schemasRef = useRef<ColSchema[]>(schemas);
  schemasRef.current = schemas;

  const onColumnResize = useCallback(
    (_column: GridColumn, newSize: number, colIndex: number) => {
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
    const colSchema = schemas[col];
    const val = rowData[colSchema.id]?.toString() ?? '';
    return {
      kind: GridCellKind.Text,
      // data: rowData[colSchema.id],
      data: val,
      displayData: val,
      allowOverlay: true,
      readonly: true,
    };
  }, [schemas]);

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

  return {
    columns: memoColumns,
    getCellContent,
    onColumnResize,
    onColumnMoved,
  };
}

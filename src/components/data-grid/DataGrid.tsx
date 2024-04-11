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

const data = csvData as AnyObject;

export type GridColumnWithGetContent = GridColumn & {
  getContent: () => GridCell;
};

function getGridColumn(col: Column): GridColumn {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getContent, ...rest } = col;
  return { ...rest };
}

export function DataGrid<RecordType extends AnyObject = AnyObject>() {

  const commonCellRender = (value: any): GridCell => {
    return {
      kind: GridCellKind.Text,
      displayData: value,
      data: value,
      allowOverlay: true,
      readonly: true,
    };
  };

  const COLUMNS: Column<RecordType>[] = [
    {
      id: "SiteID",
      title: "SiteID",
      width: 150,
      getContent: commonCellRender,
    },
    { id: "ArrivalAirport", title: "ArrivalAirport", width: 150 },
    { id: "WaybillOriginator", title: "WaybillOriginator", width: 150 },
    { id: "AirlinePrefix", title: "AirlinePrefix", width: 150 },
    { id: "AWBSerialNumber", title: "AWBSerialNumber", width: 150 },
    { id: "HouseAWB", title: "HouseAWB", width: 150 },
    { id: "MasterAWBIndicator", title: "MasterAWBIndicator", width: 150 },
    { id: "OriginAirport", title: "OriginAirport", width: 150 },
    { id: "Pieces", title: "Pieces", width: 150 },
    { id: "WeightCode", title: "WeightCode", width: 150 },
    { id: "Weight", title: "Weight", width: 150 },
    { id: "Description", title: "Description", width: 150 },
    { id: "FDAIndicator", title: "FDAIndicator", width: 150 },
    { id: "ImportingCarrier", title: "ImportingCarrier", width: 150 },
    { id: "FlightNumber", title: "FlightNumber", width: 150 },
    { id: "ArrivalDay", title: "ArrivalDay", width: 150 },
    { id: "ArrivalMonth", title: "ArrivalMonth", width: 150 },
    { id: "ShipperName", title: "ShipperName", width: 150 },
    { id: "ShipperStreetAddress", title: "ShipperStreetAddress", width: 150 },
    { id: "ShipperCity", title: "ShipperCity", width: 150 },
    {
      id: "ShipperStateOrProvince",
      title: "ShipperStateOrProvince",
      width: 150,
    },
    { id: "ShipperPostalCode", title: "ShipperPostalCode", width: 150 },
    { id: "ShipperCountry", title: "ShipperCountry", width: 150 },
    { id: "ShipperTelephone", title: "ShipperTelephone", width: 150 },
    { id: "ConsigneeName", title: "ConsigneeName", width: 150 },
    {
      id: "ConsigneeStreetAddress",
      title: "ConsigneeStreetAddress",
      width: 150,
    },
    { id: "ConsigneeCity", title: "ConsigneeCity", width: 150 },
    {
      id: "ConsigneeStateOrProvince",
      title: "ConsigneeStateOrProvince",
      width: 150,
    },
    { id: "ConsigneePostalCode", title: "ConsigneePostalCode", width: 150 },
    { id: "ConsigneeCountry", title: "ConsigneeCountry", width: 150 },
    { id: "ConsigneeTelephone", title: "ConsigneeTelephone", width: 150 },
    { id: "CustomsValue", title: "CustomsValue", width: 150 },
    { id: "CurrencyCode", title: "CurrencyCode", width: 150 },
    { id: "HTSNumber", title: "HTSNumber", width: 150 },
    { id: "ExpressRelease", title: "ExpressRelease", width: 150 },
    { id: "TRACKING NUMBER", title: "TRACKING NUMBER", width: 150 },
  ];

  const [colsMap, setColsMap] = useState(COLUMNS);

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
      return (colsMapRef.current[col].getContent ?? commonCellRender)(id && data[row][id], data[row], row);
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
      rows={data.length}
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

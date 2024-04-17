import { forwardRef, useRef } from "react";
import { DataEditor, DataEditorRef } from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { AnyObject, DataGridProps } from "./type";
import { useDataGrid } from "./useDataGrid";
import { useAsyncData } from "./useAsyncData";
import { net } from "@infra";

const fetchData = async (page: number) => {
  console.log(page);
  await new Promise((res) => setTimeout(res, 300));
  const { list: data, total } = await net.post("/api/role/getRoles", {
    page,
    size: 100,
  });
  return data;
};

export function DataGridImpl<RecordType extends AnyObject = AnyObject>(
  props: DataGridProps<RecordType>
) {
  const ref = useRef<DataEditorRef>(null);
  const { columns = [], dataSource = [] } = props;
  const dataRef = useRef<RecordType>(dataSource);
  dataRef.current = dataSource;

  const dataGridProps = useDataGrid(columns, dataRef);

  const gridArgs = useAsyncData(100, fetchData, ref, dataRef);

  return (
    <DataEditor
      ref={ref}
      {...dataGridProps}
      height={"100%"}
      {...gridArgs}
      rowMarkers="clickable-number"
      rows={1016}
      overscrollX={0}
      overscrollY={0}
    />
  );
}

export const DataGrid = forwardRef(DataGridImpl);

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "antd";
import { AgGridReact } from "ag-grid-react";
import { useTranslation } from "@locale";
import { AnyObject } from "@types";
// import columnTypes from "@components/ag-grid/column-types";
import { ClientGridProps } from "./types";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./ag-grid.css";

function InternalClientGrid<T extends AnyObject>({
  columns = [],
  gridStore,
  getRows,
}: ClientGridProps<T>) {
  const [rowData, setRowData] = useState<T[]>([]);
  const [{ page, pageSize }, onTableChange2] = useState({ page: 1, pageSize: 50 });
  const [total, setTotal] = useState(0);

  const onTableChange = (page: number, pageSize: number) => {
    onTableChange2({ page, pageSize });
  }

  useEffect(() => {
    getRows({ page, size: pageSize }).then(({ list, total }) => {
      setRowData(list);
      setTotal(total);
    })
  }, [gridStore, page, pageSize]);

  const [t] = useTranslation();
  const ref = useRef<AgGridReact>(null);

  const columnTypes = useMemo(() => {
    return {
      custom_state: {
        valueFormatter: (params: { value: boolean }) => {
          return params.value === true ? "启用" : "停用";
        }
      },
    };
  }, []);
  console.log(columnTypes);

  const [columnDefs] = useState(columns);

  const pageSizeOptions = useMemo(() => [10, 20, 50, 100, 200, 500], []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: false,
    };
  }, []);
  const showTotal = useCallback(
    (total: number) => {
      return t("共{{total}}条", { total });
    },
    [t]
  );

  useEffect(() => {
    gridStore.loadData();
  }, [gridStore]);

  return (
    <div className="flex flex-col w-full h-full overflow-visible">
      <div className={clsx("ag-theme-quartz")}>
        <AgGridReact
          ref={ref}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          rowSelection="multiple"
          rowModelType="clientSide"
          columnTypes={columnTypes}
        />
      </div>
      <Pagination
        className="mt-4 mr-5 flex justify-end"
        total={total}
        current={page}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        showQuickJumper
        onChange={onTableChange}
        showTotal={showTotal}
      />
    </div>
  );
}

export const ClientGridImpl = InternalClientGrid;

// const ClientGrid = forwardRef(ClientGridImpl) as <R extends AnyObject = AnyObject>(
//   props: React.PropsWithChildren<AgGridProps<R>> &
//     React.RefAttributes<AgGridReact>
// ) => React.ReactElement;
